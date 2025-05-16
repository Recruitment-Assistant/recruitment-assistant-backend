import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResumeAnalysisLogTable1747335363265
  implements MigrationInterface
{
  name = 'CreateResumeAnalysisLogTable1747335363265';
  tableName = 'resume_analysis_log';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "${this.tableName}" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "application_id" uuid NOT NULL,
        "ai_summary" jsonb default NULL,
        "selected" boolean,
        "score_resume_match" integer default NULL,
        "experience_level" character varying default NULL,
        "feedback" text default NULL,
        "matching_skills" character varying[] default NULL,
        "missing_skills" character varying[] default NULL,
        "learning_score" integer default NULL,
        "project_score" integer default NULL,
        "experience_score" integer default NULL,
        "skill_score" integer default NULL,
        "analyzed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "PK_resume_analysis_log_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_resume_analysis_log_application_id"
      FOREIGN KEY ("application_id") REFERENCES "application"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_resume_analysis_log_application_id"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "${this.tableName}"
    `);
  }
}
