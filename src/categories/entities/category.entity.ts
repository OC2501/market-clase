import { ProductEntity } from "../../products/entities/product.entity";
import { BaseEntity } from "./../../common/config/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('category')
export class CategoryEntity extends BaseEntity {
    

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar'})
    description?: string;

    @OneToMany(()=> ProductEntity, (products)=> products.category)
    products: ProductEntity
}
