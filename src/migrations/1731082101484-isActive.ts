import { MigrationInterface, QueryRunner } from "typeorm";

export class IsActive1731082101484 implements MigrationInterface {
    name = 'IsActive1731082101484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "is_active" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "is_active" DROP DEFAULT`);
    }

}
