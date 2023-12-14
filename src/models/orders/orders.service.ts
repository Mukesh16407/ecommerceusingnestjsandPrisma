import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Order } from './entities/order.entity';
import currency from 'currency.js';
import { Role } from '@prisma/client';
import { FindOrderDto } from './dto/find-order.dto';
import { NotPurchaseOwnerException } from './exceptions/not-Order-owner.exception';
import { ReviewOrderDto } from './dto/review-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  // create(createOrderDto: CreateOrderDto) {
  //   return 'This action adds a new order';
  // }
/** Creates a new purchase */
async create(
  userId: string,
  createOrderDto: CreateOrderDto,
): Promise<Order> {
  const totalPrice = await this.calculateTotalPrice(createOrderDto);
   
  const order = await this.prisma.order.create({
    data: { ...createOrderDto, userId, totalPrice },
    include: {
      user: { select: { email: true } },
      product: { select: { name: true } },
    },
  });

  return order;
}
  /** Returns all purchases with pagination
   * Default is starting on page 1 showing 10 results per page
   * and ordering by name
   */
  async findAll({
    userId,
    productId,
    page = 1,
    offset = 10,
  }: FindOrderDto): Promise<Order[]> {
    const OrdersToSkip = (page - 1) * offset;

    const purchases = await this.prisma.order.findMany({
      skip: OrdersToSkip,
      take: offset,
      where: {
        userId: { equals: userId },
        productId: { equals: productId },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true } },
        product: { select: { name: true } },
      },
    });

    return purchases;
  }

  async findOne(
    orderId: string,
    userId: string,
    userRole: string,
  ): Promise<Order | null> {
    const purchase = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { email: true } },
        product: { select: { name: true } },
      },
      //rejectOnNotFound: true,
    });

    if (userRole !== Role.ADMIN && purchase.userId !== userId) {
      throw new NotPurchaseOwnerException();
    }

    return purchase;
  }

    /** Users review products purchased by them */
    async review(
      userId: string,
      orderId: string,
      reviewOrderDto: ReviewOrderDto,
    ): Promise<Order | null> {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        //rejectOnNotFound: true,
      });
  
      if (userId !== order.userId) {
        throw new NotPurchaseOwnerException();
      }
  
      return this.prisma.order.update({
        where: { id: orderId },
        data: { ...reviewOrderDto },
        include: {
          user: { select: { email: true } },
          product: { select: { name: true } },
        },
      });
    }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  private async calculateTotalPrice(
    createOrderDto: CreateOrderDto,
  ): Promise<number> {
    const { basePrice } = await this.prisma.product.findUnique({
      where: { id: createOrderDto.productId },
    });

    const totalPrice = currency(basePrice.toNumber()).multiply(
      createOrderDto.amount,
    );

    return totalPrice.value;
  }
}
