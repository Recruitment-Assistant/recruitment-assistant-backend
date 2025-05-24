import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCandidateTable1747330941382 implements MigrationInterface {
  name = 'CreateCandidateTable1747330941382';
  tableName = 'candidate';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "${this.tableName}" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "organization_id" uuid DEFAULT NULL,
        "created_by" uuid DEFAULT NULL,
        "full_name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone_number" character varying NOT NULL,
        "address" character varying DEFAULT NULL,
        "gender" character varying DEFAULT NULL,
        "date_of_birth" date DEFAULT NULL,
        "linkedin_profile" character varying DEFAULT NULL,
        "portfolio_url" character varying DEFAULT NULL,
        "education" jsonb DEFAULT NULL,
        "work_experience" jsonb DEFAULT NULL,
        "skills" character varying[] DEFAULT NULL,
        "languages" character varying[] DEFAULT NULL,
        "certifications" character varying[] DEFAULT NULL,
        "summary" text DEFAULT NULL,
        "resume" jsonb DEFAULT NULL,
        "source" character varying DEFAULT NULL,
        "notes" text DEFAULT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "PK_candidate_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_candidate_email_organization"
      ON "${this.tableName}" ("email", "organization_id")
      WHERE "deleted_at" IS NULL;
  `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}"
        ADD CONSTRAINT "FK_candidate_organization_id"
        FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}"
        ADD CONSTRAINT "FK_candidate_created_by"
        FOREIGN KEY ("created_by") REFERENCES "user"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "UQ_candidate_email_organization"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_candidate_created_by"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_candidate_organization_id"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "${this.tableName}"
    `);
  }
}
