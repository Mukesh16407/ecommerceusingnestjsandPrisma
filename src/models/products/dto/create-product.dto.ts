import { OmitType } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/binary';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Product } from '../entities/product.entity';

export class CreateProductDto extends OmitType(Product, [
  'id',
  'createdAt',
  'urlName',
  'picture',
] as const) {
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  basePrice: string | number | Decimal;

  @IsNumber()
  @IsOptional()
  discountPercentage?: number;

  @IsInt()
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  categories?: string[];
}