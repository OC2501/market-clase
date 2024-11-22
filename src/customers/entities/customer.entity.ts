import { PurchaseEntity } from "../../purchases/entities/purchase.entity";
import { BaseEntity } from "../../common/config/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('customer')
export class CustomerEntity extends BaseEntity {
    
    @Column({type: "varchar"})
    name: string

    @Column({type: "varchar"})
    contact: string

    @Column({type: "varchar"})
    address: string

    @Column({type: "varchar"})
    city: string

    @Column({type: "int"})
    postalCode?: number

    @Column({type: "varchar"})
    country: string

    @OneToMany(() => PurchaseEntity, (purchase) => purchase.customer )
    purchase: PurchaseEntity[]

}
