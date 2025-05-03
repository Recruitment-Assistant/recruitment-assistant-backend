import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserOrganizationTable1746179930369
  implements MigrationInterface
{
  name = 'CreateUserOrganizationTable1746179930369';
  tableName = 'user_organization';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "${this.tableName}" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "user_id" uuid NOT NULL,
          "organization_id" uuid NOT NULL,
          "is_owner" boolean DEFAULT false,
          "joined_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
          CONSTRAINT "PK_user_organization_id" PRIMARY KEY ("id")
        )
      `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}"
        ADD CONSTRAINT "FK_user_organization_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
      `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}"
        ADD CONSTRAINT "FK_user_organization_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
      `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}"
        ADD CONSTRAINT "UQ_user_organization_user_id_organization_id" UNIQUE ("user_id", "organization_id")
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "${this.tableName}" DROP CONSTRAINT "UQ_user_organization_user_id_organization_id"
      `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_user_organization_organization_id"
      `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_user_organization_user_id"
      `);

    await queryRunner.query(`
        DROP TABLE "${this.tableName}"
      `);
  }
}
