import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { ResponseAllProducts } from './interfaces/response-products.interface';
import { ManagerError } from 'src/common/errors/manager.error';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ){}


  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    try {
    const product = await this.productsRepository.save(createProductDto)
    if(!product){
      throw new ManagerError({
        type: 'CONFLICT',
        message: 'product not created!'
      })
    }

      return product;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<ResponseAllProducts> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [total, data] = await Promise.all([
        this.productsRepository.count({ where: {isActive: true} }),
        this.productsRepository.createQueryBuilder('product')
      .where({isActive: true})
      .leftJoinAndSelect('product.supplier','supplier')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.stock', 'stock')
      .take(limit)
      .skip(skip)
      .getMany()
      ]) 

      const lastPage = Math.ceil(total / limit);

      return {
        page,
        limit,
        lastPage,
        total,
        data,
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findOne(id: string): Promise<ProductEntity> {
    try {
      const product = await this.productsRepository.createQueryBuilder('product')
      .where({id, isActive: true})
      .leftJoinAndSelect('product.supplier','supplier')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.stock', 'stock')
      .getOne()
      if (!product) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: "product not found",
        })
      }

      return product
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<UpdateResult> {
    try {
      const product = await this.productsRepository.update({id}, updateProductDto)
      if (product.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'product not found',
        });
      }

      return product;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string): Promise<UpdateResult> {
    try {
      const product = await this.productsRepository.update({id}, { isActive: false})
      if (product.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'product not found',
        });
      }

      return product;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
