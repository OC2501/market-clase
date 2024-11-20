import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./../../common/config/base.entity";
import { StockEntity } from "../../stock/entities/stock.entity";

@Entity('warehouses')
export class WarehouseEntity extends BaseEntity{
@Column()
name: string
@Column()
description: string
@OneToMany(()=> StockEntity, (stock)=> stock.warehouse)
stock: StockEntity[]
}
