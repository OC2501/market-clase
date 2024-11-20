import { IsNumber, IsOptional, IsString, Min } from "class-validator"

export class CreateStockDto {
    @IsNumber()
    @Min(0)
    quantity: number
    
    @IsString()
    @IsOptional()
    description?: string
}
