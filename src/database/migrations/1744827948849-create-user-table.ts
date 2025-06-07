import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1744827948849 implements MigrationInterface {
  name = 'CreateUserTable1744827948849';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "phone_number" character varying DEFAULT NULL,
        "name" character varying NOT NULL,
        "avatar" character varying DEFAULT NULL,
        "date_of_birth" date DEFAULT NULL,
        "gender" character varying(10) DEFAULT NULL,
        "is_active" boolean DEFAULT false,
        "is_confirmed" boolean DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT null,
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_user_email" ON "user" ("email")
      WHERE "deleted_at" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "UQ_user_email"
    `);

    await queryRunner.query(`
      DROP TABLE "user"
    `);
  }
}
