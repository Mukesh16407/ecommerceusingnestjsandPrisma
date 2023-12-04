import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { UsersModule } from '../models/users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AccessJwtStrategy } from './access-jwt.strategy';


@Module({
  imports: [UsersModule, PrismaModule, PassportModule, JwtModule.register({})],
  controllers: [AuthsController],
  providers: [AuthsService,  AccessJwtStrategy  ],
})
export class AuthsModule {}
