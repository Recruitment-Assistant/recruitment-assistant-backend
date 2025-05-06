import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePositionTable1746545710394 implements MigrationInterface {
  name = 'CreatePositionTable1746545710394';
  tableName = 'position';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "${this.tableName}" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "organization_id" uuid NOT NULL,
          "title" character varying NOT NULL,
          "description" character varying DEFAULT NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
          CONSTRAINT "PK_position_id" PRIMARY KEY ("id")
        )
      `);

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "FK_position_organization_id"
      FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
      ON DELETE CASCADE ON UPDATE CASCADE 
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "${this.tableName}" DROP CONSTRAINT "FK_position_organization_id"
      `);

    await queryRunner.query(`
        DROP TABLE IF EXISTS "${this.tableName}"
      `);
  }
}
