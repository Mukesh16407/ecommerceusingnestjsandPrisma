import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerUploadConfig } from 'src/config/multer-update.config';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [PrismaModule,MulterModule.register(multerUploadConfig)],
})
export class ProductsModule {}
