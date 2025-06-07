import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStageTable1749261479227 implements MigrationInterface {
  name = 'CreateStageTable1749261479227';
  tableName = 'stage';
  pipelineTableName = 'pipeline';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "${this.tableName}" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "pipeline_id" uuid NOT NULL,
        "name" character varying(255) NOT NULL,
        "stage_order" integer NOT NULL,
        "sla_days" integer DEFAULT NULL,
        "is_terminal" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "PK_stage_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_stage_pipeline_id"
      FOREIGN KEY ("pipeline_id") REFERENCES "${this.pipelineTableName}"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_stage_pipeline_order"
      ON "${this.tableName}"("pipeline_id", "stage_order")
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_stage_pipeline_name"
      ON "${this.tableName}"("pipeline_id", "name")
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_stage_pipeline_id"
      ON "${this.tableName}"("pipeline_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_stage_pipeline_id"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "UQ_stage_pipeline_name"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "UQ_stage_pipeline_order"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT IF EXISTS "FK_stage_pipeline_id"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "${this.tableName}"
    `);
  }
}
