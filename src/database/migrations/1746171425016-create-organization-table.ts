import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizationTable1746171425016
  implements MigrationInterface
{
  name = 'CreateOrganizationTable1746171425016';
  tableName = 'organization';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "${this.tableName}" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "name" character varying(255) NOT NULL,
          "address" character varying(255) NOT NULL,
          "logo_url" character varying(255) DEFAULT NULL,
          "created_by" uuid NOT NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
          CONSTRAINT "PK_organization_id" PRIMARY KEY ("id")
        )
      `);

    await queryRunner.query(`
        ALTER TABLE "${this.tableName}"
        ADD CONSTRAINT "FK_organization_created_by" FOREIGN KEY ("created_by") REFERENCES "user"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_organization_created_by"
      `);

    await queryRunner.query(`
        DROP TABLE "${this.tableName}"
      `);
  }
}
