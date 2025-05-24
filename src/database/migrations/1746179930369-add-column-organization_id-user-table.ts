import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnOrganizationIdUserTable1746179930369
  implements MigrationInterface
{
  name = 'AddColumnOrganizationIdUserTable1746179930369';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user"
        ADD COLUMN "organization_id" UUID DEFAULT NULL
      `);

    await queryRunner.query(`
        ALTER TABLE "user"
        ADD CONSTRAINT "FK_user_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "user" DROP CONSTRAINT "FK_user_organization_id"
      `);

    await queryRunner.query(`
        ALTER TABLE "user" DROP COLUMN "organization_id"
      `);
  }
}
