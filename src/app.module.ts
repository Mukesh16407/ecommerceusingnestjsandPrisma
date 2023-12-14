import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './models/users/users.module';
import { ProductsModule } from './models/products/products.module';
import { CategorysModule } from './models/categorys/categorys.module';
import { OrdersModule } from './models/orders/orders.module';
import { InvoicesModule } from './models/invoices/invoices.module';
import { AuthsModule } from './auths/auths.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessJwtAuthGuard } from './auths/access-jwt-auth.guard';
import { ProfilesModule } from './models/profiles/profiles.module';

@Module({
  imports: [PrismaModule, UsersModule, ProductsModule, CategorysModule, OrdersModule, InvoicesModule, AuthsModule,ProfilesModule],
  providers: [ {
    provide: APP_GUARD,
    useClass: AccessJwtAuthGuard,
  },],
})
export class AppModule {}
