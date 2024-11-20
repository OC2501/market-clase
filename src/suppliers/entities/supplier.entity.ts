import { ProductEntity } from "../../products/entities/product.entity";
import { BaseEntity } from "./../../common/config/base.entity";;
import { Column, Entity, OneToMany } from "typeorm";
@Entity('supplier')
export class SupplierEntity extends BaseEntity{
    @Column({type: 'varchar'})
    name: string;

    @Column({type: 'varchar'})
    phone?: string;

    @Column({type: 'varchar'})
    email: string;

    @Column({type: 'varchar'})
    address?: string;

    @OneToMany(()=>ProductEntity, (products)=> products.supplier)
    products: ProductEntity

}