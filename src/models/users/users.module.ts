import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UserService],
  imports: [PrismaModule],
  exports: [UserService],
 
})
export class UsersModule {}
