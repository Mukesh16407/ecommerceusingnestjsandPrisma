import { PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { Order } from '../entities/order.entity';

/** Describes the fields needed to create a Purchase */
export class CreateOrderDto extends PickType(Order, [
  'productId',
  'amount',
]) {
  /** Product ID as UUID
   * @example "5c68ae94-bf3e-4fde-b01f-25d18b3976a0"
   */
  @IsUUID(4)
  productId: string;

  /** Amount purchased of the product
   * Defaults to 1
   * @example 2
   */
  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount: number;
}