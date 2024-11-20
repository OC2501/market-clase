import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAndUpdated1731681549679 implements MigrationInterface {
    name = 'CreateAndUpdated1731681549679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_557112c9955555e7d08fa913f3f"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "stock_id"`);
        await queryRunner.query(`ALTER TABLE "stock" ADD "product_id" uuid`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_375ba760c8cff338fc8c94b416c" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT "FK_375ba760c8cff338fc8c94b416c"`);
        await queryRunner.query(`ALTER TABLE "stock" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "stock_id" uuid`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_557112c9955555e7d08fa913f3f" FOREIGN KEY ("stock_id") REFERENCES "stock"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
