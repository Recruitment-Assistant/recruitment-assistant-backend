import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApplicationStageHistoryTable1749264016838
  implements MigrationInterface
{
  private tableName = 'application_stage_history';
  private applicationTableName = 'application';
  private stageTableName = 'stage';
  private userTableName = 'user';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "${this.tableName}" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "application_id" uuid NOT NULL,
        "stage_id" uuid NOT NULL,
        "entered_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "exited_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        "status_at_entry" character varying(50) NOT NULL,
        "status_at_exit" character varying(50) DEFAULT NULL,
        "notes" text DEFAULT NULL,
        "action_by_user_id" uuid DEFAULT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "PK_application_stage_history_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_application_stage_history_application_id"
      FOREIGN KEY ("application_id") REFERENCES "${this.applicationTableName}"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_application_stage_history_stage_id"
      FOREIGN KEY ("stage_id") REFERENCES "${this.stageTableName}"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE 
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_application_stage_history_action_by_user_id"
      FOREIGN KEY ("action_by_user_id") REFERENCES "${this.userTableName}"("id")
      ON DELETE SET NULL ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_application_stage_history_application_id"
      ON "${this.tableName}"("application_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_application_stage_history_stage_id"
      ON "${this.tableName}"("stage_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_application_stage_history_stage_id"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_application_stage_history_application_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT IF EXISTS "FK_application_stage_history_action_by_user_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT IF EXISTS "FK_application_stage_history_stage_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT IF EXISTS "FK_application_stage_history_application_id"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "${this.tableName}"
    `);
  }
}
