import { PurchaseStatus } from "../../common/enums/purchase-status.enum";
import { BaseEntity } from "../../common/config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PaymentMethodEntity } from "../../payment-methods/entities/payment-method.entity";
import { CustomerEntity } from "../../customers/entities/customer.entity";


@Entity('purchase')
export class PurchaseEntity extends BaseEntity{

    @Column({type: "varchar"})
    status: PurchaseStatus 

    @ManyToOne(() => PaymentMethodEntity, (paymentMethod) => paymentMethod.purchase)
    @JoinColumn({name: "payment_method_id"})
    paymentMethod: string;

    @ManyToOne(() => CustomerEntity, (customer) => customer.purchase )
    @JoinColumn({name: "customer_id"})
    customer: string;
}
