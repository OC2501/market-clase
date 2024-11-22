import { PurchaseEntity } from "../../purchases/entities/purchase.entity";
import { BaseEntity } from "../../common/config/base.entity";
import { Column, Entity, OneToMany } from "typeorm";


@Entity('payment_methods')
export class PaymentMethodEntity extends BaseEntity{

    @Column({type: "varchar"})
    paymentMethod: string;

    @OneToMany(() => PurchaseEntity, (purchase) => purchase.paymentMethod)
    purchase: PurchaseEntity[];
}
