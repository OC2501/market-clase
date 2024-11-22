import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from './entities/purchase.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { ResponseAllPurchases } from './interfaces/response-purchases.interface';
import { ApiAllResponse } from 'src/common/interfaces/api-response.interface';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto): Promise<PurchaseEntity> {
    try {
      const purchase = await this.purchaseRepository.save(createPurchaseDto);
      if (!purchase) {
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'Purchase not created!',
        });
      }
      return purchase;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<ApiAllResponse<PurchaseEntity>> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      // const total = await this.categoryRepository.count({ where: { isActive: true } });
      // const data = await this.categoryRepository.find({ where: { isActive: true }, take: limit, skip: skip })
      const [total, data] = await Promise.all([
        this.purchaseRepository.count({ where: { isActive: true } }),
        this.purchaseRepository
          .createQueryBuilder('purchase')
          .where({ isActive: true })
          .leftJoinAndSelect('purchase.paymentMethod', 'paymentMethod')
          .leftJoinAndSelect('purchase.customer', 'customer')
          .take(limit)
          .skip(skip)
          .getMany(),
      ]);
      const lastPage = Math.ceil(total / limit);

      if (!data) {
        new ManagerError({
          type: 'NOT_FOUND',
          message: 'No hay Purchases',
        });
      }

      return {
        meta: {
          page,
          limit,
          lastPage,
          total,
        },
        data,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findOne(id: string): Promise<PurchaseEntity> {
    try {
      const purchase = await this.purchaseRepository
        .createQueryBuilder('purchase')
        .where({ isActive: true })
        .leftJoinAndSelect('purchase.paymentMethod', 'paymentMethod')
        .leftJoinAndSelect('purchase.customer', 'customer')
        .getOne();

      if (!purchase) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Purchase not found',
        });
      }

      return purchase;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(
    id: string,
    updatePurchaseDto: UpdatePurchaseDto,
  ): Promise<UpdateResult> {
    try {
      const purchase = await this.purchaseRepository.update(
        id,
        updatePurchaseDto,
      );
      if (purchase.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Purchaseo not found',
        });
      }

      return purchase;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string): Promise<UpdateResult> {
    try {
      const purchase = await this.purchaseRepository.update(
        { id },
        { isActive: false },
      );
      if (purchase.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Purchase not found',
        });
      }

      return purchase;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
