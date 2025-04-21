##################
# BUILD BASE IMAGE
##################

FROM node:20.17.0-alpine AS base
WORKDIR /app
COPY package*.json ./

#############################
# BUILD FOR LOCAL DEVELOPMENT
#############################

FROM base AS development
WORKDIR /app
RUN chown -R node:node /app

# Install all dependencies (including devDependencies)
RUN npm install
COPY . .

# Use the node user from the image (instead of the root user)
USER node

FROM base AS builder
WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node --from=development /app/src ./src
COPY --chown=node:node --from=development /app/tsconfig.json ./tsconfig.json
COPY --chown=node:node --from=development /app/tsconfig.build.json ./tsconfig.build.json
COPY --chown=node:node --from=development /app/nest-cli.json ./nest-cli.json

RUN npm run build

# Removes unnecessary packages adn re-install only production dependencies
ENV NODE_ENV production
RUN npm prune --prod && npm ci --only=production

USER node

######################
# BUILD FOR PRODUCTION
######################

FROM node:20.17.0-alpine AS production
WORKDIR /app

RUN mkdir -p src/generated && chown -R node:node src

# Copy the bundled code from the build stage to the production image
COPY --from=builder /app/src/generated/i18n.generated.ts ./src/generated/i18n.generated.ts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

USER node

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
