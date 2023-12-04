import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Order } from './entities/order.entity';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { FindOrderDto } from './dto/find-order.dto';
import { ReviewOrderDto } from './dto/review-order.dto';

 /** Exposes Order CRUD endpoints */
 @ApiTags('Order')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

 

    /** Creates a new Order, only for logged users */
    @ApiOperation({ summary: 'Creates a new Order' })
    @ApiBearerAuth()
    @Post()
    async create(
      @Req() request: Request,
      @Body() createOrderDto: CreateOrderDto,
    ): Promise<Order> {
     
      const { userId } = request.user as { userId: string };
      return this.ordersService.create(userId, createOrderDto);
    }

    @ApiOperation({ summary: 'Admin gets all orders' })
    @IsAdmin()
    @Get('/admin')
    async findAll(
      @Query() findOrderDto: FindOrderDto,
    ): Promise<Order[]> {
      return this.ordersService.findAll(findOrderDto);
    }

     /** Returns all users' purchases with pagination,
   *
   * Default is starting on page 1 showing 10 results per page,
   * matching by productId and ordering by most recent date
   */
  @ApiOperation({ summary: 'User gets all their orders' })
  @ApiBearerAuth()
  @Get()
  async findAllMine(
    @Req() request: Request,
    @Query() findOrderDto: FindOrderDto,
  ): Promise<Order[]> {
    const { userId } = request.user as { userId: string };
    findOrderDto.userId = userId;

    return this.ordersService.findAll(findOrderDto);
  }

   /** Reviews purchased product, must be purchase owner */
   @ApiOperation({ summary: 'Reviews purchased product' })
   @ApiBearerAuth()
   @Patch('/review/:id')
   async review(
     @Req() request: Request,
     @Param('id') orderId: string,
     @Body() reviewOrdereDto: ReviewOrderDto,
   ): Promise<Order> {
    console.log(reviewOrdereDto,"reviewOrderDto")
     const { userId } = request.user as { userId: string };
 
     return this.ordersService.review(userId, orderId, reviewOrdereDto);
   }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
