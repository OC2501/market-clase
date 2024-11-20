import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./../../common/config/base.entity";
import { SupplierEntity } from "../../suppliers/entities/supplier.entity";
import { CategoryEntity } from "../../categories/entities/category.entity";
import { StockEntity } from "../../stock/entities/stock.entity";

@Entity('product')
export class ProductEntity extends BaseEntity{
    @Column({ type: 'varchar' })
    name: string;
    @Column({ type: 'varchar' })
    description?: string;
    @Column({ type: 'float' })
    price?: number;

    @ManyToOne(()=>CategoryEntity, (category)=> category.products)
    @JoinColumn({name: 'category_id'})
    category: string;

    @ManyToOne(() => SupplierEntity, (supplier)=> supplier.products)
    @JoinColumn({name: 'supplier_id'})
    supplier: string;

    @OneToMany(()=> StockEntity, (stock)=> stock.product)
    stock: StockEntity[]
}
