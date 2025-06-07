import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateJobTable1749261486640 implements MigrationInterface {
  name = 'CreateJobTable1749261486640';
  tableName = 'job';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "${this.tableName}" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "organization_id" uuid NOT NULL,
        "department_id" uuid DEFAULT NULL,
        "pipeline_id" uuid NOT NULL,
        "created_by" uuid NOT NULL,
        "title" character varying NOT NULL,
        "tags" character varying[] NOT NULL,
        "description" text NOT NULL,
        "requirements" text NOT NULL,
        "location" character varying NOT NULL,
        "published_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        "closed_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        "status" character varying NOT NULL DEFAULT 'DRAFT',
        "quantity" integer DEFAULT 1,
        "remote_eligible" boolean DEFAULT false,
        "employment_type" character varying NOT NULL,
        "salary_range" jsonb DEFAULT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "PK_job_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_job_organization_id"
      FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_job_department_id"
      FOREIGN KEY ("department_id") REFERENCES "department"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_job_pipeline_id"
      FOREIGN KEY ("pipeline_id") REFERENCES "pipeline"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_job_created_by"
      FOREIGN KEY ("created_by") REFERENCES "user"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_job_created_by"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_job_pipeline_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_job_department_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_job_organization_id"
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS "${this.tableName}"`);
  }
}
