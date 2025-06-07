import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePipelineTable1749261246328 implements MigrationInterface {
  name = 'CreatePipelineTable1749261246328';
  tableName = 'pipeline';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "${this.tableName}" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "organization_id" uuid NOT NULL,
        "name" character varying(255) NOT NULL,
        "description" text DEFAULT NULL,
        "is_default" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "PK_pipeline_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_pipeline_organization_id"
      FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_pipeline_organization_name"
      ON "${this.tableName}"("organization_id", "name")
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_pipeline_organization_id"
      ON "${this.tableName}"("organization_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_pipeline_organization_id"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "UQ_pipeline_organization_name"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT IF EXISTS "FK_pipeline_organization_id"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "${this.tableName}"
    `);
  }
}
