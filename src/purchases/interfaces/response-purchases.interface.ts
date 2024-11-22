import { PurchaseEntity } from "../entities/purchase.entity";

export interface ResponseAllPurchases{
    page: number;
    lastPage: number;
    limit: number;
    total: number;
    data: PurchaseEntity[];
}