import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApplicationTable1747334902005 implements MigrationInterface {
  name = 'CreateApplicationTable1747334902005';
  tableName = 'application';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "${this.tableName}" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "organization_id" uuid DEFAULT NULL,
        "candidate_id" uuid NOT NULL,
        "job_id" uuid NOT NULL,
        "source" character varying DEFAULT NULL,
        "resume" jsonb NOT NULL,
        "raw_resume_text" text DEFAULT NULL,
        "screening_score" float DEFAULT 0,
        "screening_note" text DEFAULT NULL,
        "final_score" float DEFAULT NULL,
        "score_resume_match" integer DEFAULT NULL,
        "current_stage" character varying DEFAULT NULL,
        "status" character varying DEFAULT NULL,
        "expected_salary" decimal DEFAULT NULL,
        "referred_by" character varying DEFAULT NULL,
        "applied_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "PK_application_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_application_organization_id"
      FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_application_candidate_id"
      FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_application_job_id"
      FOREIGN KEY ("job_id") REFERENCES "job"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_application_candidate_id" ON "${this.tableName}" ("candidate_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_application_job_id" ON "${this.tableName}" ("job_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "UQ_candidate_id_job_id" UNIQUE ("candidate_id", "job_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_application_job_id"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_application_candidate_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_application_job_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_application_candidate_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_application_organization_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT "UQ_candidate_id_job_id"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "${this.tableName}"
    `);
  }
}
