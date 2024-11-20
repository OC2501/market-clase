import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from './entities/stock.entity';

@Module({
  controllers: [StockController],
  providers: [StockService],
  exports:[],
  imports: [
    TypeOrmModule.forFeature([StockEntity]),
  ]
})
export class StockModule {}
