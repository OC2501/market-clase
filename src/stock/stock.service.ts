import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StockEntity } from './entities/stock.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ManagerError } from 'src/common/errors/manager.error';
import { ResponseAllStocks } from './interface/stock.interface';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Injectable()
export class StockService {

  constructor(
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>
  ){}
  async create(createStockDto: CreateStockDto): Promise<StockEntity> {
    try {
      const stock = await this.stockRepository.save(createStockDto)
      if(!stock){
        throw new ManagerError({
          type: 'CONFLICT',
          message: 'stock not created!'
        })
      }
  
        return stock;
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
  }

  async findAll(paginationDto: PaginationDto): Promise<ResponseAllStocks> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;
    try {
        const [total, data] = await Promise.all([
          this.stockRepository.count({ where: {isActive: true} }),
          this.stockRepository.createQueryBuilder('stock')
          .where({isActive: true})
          .leftJoinAndSelect('stock.warehouse', 'warehouse')
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

  async findOne(id: string): Promise<StockEntity> {
    try {
      const stock = await this.stockRepository.createQueryBuilder('stock')
      .where({id, isActive: true})
      .leftJoinAndSelect('stock.warehouse', 'warehouse')
      .getOne()

      if(!stock){
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'stock not found!'
        })
      }
      return stock;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateStockDto: UpdateStockDto): Promise<UpdateResult> {
    try {
      const stock = await this.stockRepository.update({id}, updateStockDto);
      if(!stock){
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'stock not found!'
        })
      }
      return stock;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string): Promise<UpdateResult> {
    try {
      const stock = await this.stockRepository.update({id}, {isActive: false});
      if(!stock){
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'stock not found!'
        })
      }
      return stock;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
