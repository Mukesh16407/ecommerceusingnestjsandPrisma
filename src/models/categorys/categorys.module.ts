import { Module } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CategorysController } from './categorys.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  controllers: [CategorysController],
  providers: [CategorysService],
  imports: [PrismaModule],
})
export class CategorysModule {}
