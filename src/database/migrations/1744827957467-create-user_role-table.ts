import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserRoleTable1744827957467 implements MigrationInterface {
  name = 'CreateUserRoleTable1744827957467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_role" (
        "user_id" uuid NOT NULL,
        "role_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT null,
        CONSTRAINT "PK_user_role" PRIMARY KEY ("user_id", "role_id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "user_role"
      ADD CONSTRAINT "FK_user_role_user" FOREIGN KEY ("user_id")
      REFERENCES "user"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_role"
      ADD CONSTRAINT "FK_user_role_role" FOREIGN KEY ("role_id")
      REFERENCES "role"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_user_role_user"`,
    );

    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_user_role_role"`,
    );

    await queryRunner.query(`
      DROP TABLE "user_role"
    `);
  }
}
