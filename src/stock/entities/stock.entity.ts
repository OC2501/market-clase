import { WarehouseEntity } from "../../warehouses/entities/warehouse.entity";
import { ProductEntity } from "../../products/entities/product.entity";
import { BaseEntity } from "./../../common/config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity('stock')
export class StockEntity extends BaseEntity {
    @Column()
    quantity: number

    @Column({type: 'varchar'})
    description?: string

    @ManyToOne(()=> ProductEntity, (product)=> product.stock)
    @JoinColumn({name: 'product_id'})
    product: string

    @ManyToOne(()=> WarehouseEntity, (warehouse)=> warehouse.stock)
    @JoinColumn({name: 'warehouse_id'})
    warehouse: string
}
