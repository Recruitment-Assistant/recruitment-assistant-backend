import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScopeAndOrganizationIdRoleTable1746171909354
  implements MigrationInterface
{
  name = 'AddScopeAndOrganizationIdRoleTable1746171909354';
  tableName = 'role';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "${this.tableName}"
        ADD COLUMN "scope" character varying(255) NOT NULL DEFAULT 'SYSTEM'
      `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}"
        ADD COLUMN "organization_id" UUID DEFAULT NULL
      `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}"
        ADD CONSTRAINT "FK_role_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
        ON DELETE SET NULL ON UPDATE CASCADE
      `);

    await queryRunner.query(`
        DROP INDEX IF EXISTS "UQ_role_name";
      `);

    await queryRunner.query(`
        CREATE INDEX "IDX_role_name_role_organization_id" 
        ON "role"("name", "organization_id")
        WHERE "deleted_at" IS NULL;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_role_name_role_organization_id";
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_role_name" ON "role"("name")
      WHERE "deleted_at" IS NULL;
    `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_role_organization_id"
      `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}" DROP COLUMN "organization_id"
      `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}" DROP COLUMN "scope"
      `);
  }
}
