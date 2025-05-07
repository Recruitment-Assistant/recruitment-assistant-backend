import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateJobTable1746642671498 implements MigrationInterface {
  name: string = 'CreateJobTable1746642671498';
  tableName: string = 'job';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "${this.tableName}" (
              "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
              "job_code" character varying DEFAULT NULL,
              "organization_id" uuid,
              "department_id" uuid DEFAULT NULL,
              "position_id" uuid NOT NULL,
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
              "applicants_count" integer DEFAULT 0,
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
            ON DELETE SET NULL ON UPDATE CASCADE
          `);

    await queryRunner.query(`
            ALTER TABLE "${this.tableName}"
            ADD CONSTRAINT "FK_job_department_id"
            FOREIGN KEY ("department_id") REFERENCES "department"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
          `);

    await queryRunner.query(`
            ALTER TABLE "${this.tableName}"
            ADD CONSTRAINT "FK_job_position_id"
            FOREIGN KEY ("position_id") REFERENCES "position"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_job_position_id"
          `);

    await queryRunner.query(`
            ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_job_organization_id"
          `);

    await queryRunner.query(`
            DROP TABLE IF EXISTS "${this.tableName}"
          `);
  }
}
