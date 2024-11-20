import { Injectable } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseEntity } from './entities/warehouse.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ManagerError } from 'src/common/errors/manager.error';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { ResponseAllWarehouses } from './interface/responseallwarehouses';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepository: Repository<WarehouseEntity>,
  ){}
  async create(createWarehouseDto: CreateWarehouseDto): Promise<WarehouseEntity> {
    try {
      const warehouse = await this.warehouseRepository.save(createWarehouseDto);
      if(!warehouse) {
          throw new ManagerError({
              type: 'CONFLICT',
              message: 'warehouse not created!',
          })
      }
      return warehouse;
  } catch (error) {
      ManagerError.createSignatureError(error.message);
  }
  }

  async findAll(paginationDto: PaginationDto): Promise<ResponseAllWarehouses> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;
    try {
      const [total, data] = await Promise.all([
        this.warehouseRepository.count({ where: {isActive: true} }),
        this.warehouseRepository.find({where: {isActive: true}, take: limit, skip: skip}),
      ]);
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

  async findOne(id: string): Promise<WarehouseEntity> {
    try {
      const warehouse = await this.warehouseRepository.findOneBy({id});
      if(!warehouse) {
          throw new ManagerError({
              type: 'NOT_FOUND',
              message: 'warehouse not found!',
          })
      }
      return warehouse;
  } catch (error) {
      ManagerError.createSignatureError(error.message);
  }
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto): Promise<UpdateResult> {
    try {
      const warehouse = await this.warehouseRepository.update({id}, updateWarehouseDto);
      if(!warehouse) {
          throw new ManagerError({
              type: 'NOT_FOUND',
              message: 'warehouse not found!',
          })
      }
      return warehouse;
  } catch (error) {
      ManagerError.createSignatureError(error.message);
  }
  }

  async remove(id: string): Promise<UpdateResult> {
    try {
      const warehouse = await this.warehouseRepository.update({id}, {isActive: false});
      if(!warehouse) {
          throw new ManagerError({
              type: 'NOT_FOUND',
              message: 'warehouse not found!',
          })
      }
      return warehouse;
  }
  catch (error) {
      ManagerError.createSignatureError(error.message);
  }
  }
}
