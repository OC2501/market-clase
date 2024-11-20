import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { ManagerError } from 'src/common/errors/manager.error';
import { ResponseAllCategories } from './interfaces/response-categories.interface';
import { PaginationDto } from '../common/dtos/pagination/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRespository: Repository<CategoryEntity>
  ){}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    try {
    const category = await this.categoryRespository.save(createCategoryDto)
    if(!category){
      throw new ManagerError({
        type: 'CONFLICT',
        message: 'category not created!'
      })
    }

    return category;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<ResponseAllCategories> {
    const { limit, page } = paginationDto;
    const skip = (page - 1) * limit;

    try{
      
      const [total, data] = await Promise.all([
        this.categoryRespository.count({ where: {isActive: true} }),
        this.categoryRespository.find({where: {isActive: true}, take: limit, skip: skip})
      ]) 

      const lastPage = Math.ceil(total / limit);
      
      return {
        page,
        limit,
        lastPage,
        total,
        data
      };
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async findOne(id: string): Promise<CategoryEntity> {
    try {
      const category = await this.categoryRespository.createQueryBuilder('category')
      .where({id, isActive: true})
      .leftJoinAndSelect('category.products', 'products')
      .getOne()
      if (!category) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: "Category not found",
        })
      }

      return category;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<UpdateResult> {
    try {
      const category = await this.categoryRespository.update({id}, updateCategoryDto)
      if (category.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return category;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }

  async remove(id: string): Promise<UpdateResult> {
    try {
      const category = await this.categoryRespository.update({id}, { isActive: false})
      if (category.affected === 0) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return category;
    } catch (error) {
      ManagerError.createSignatureError(error.message);
    }
  }
}
