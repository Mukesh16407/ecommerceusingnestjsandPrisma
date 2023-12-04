// src/prisma/prisma.service.ts

import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {ConfigService} from '@nestjs/config'
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit  {
     /** Optional — if you leave it out,
   * Prisma will connect lazily on its first call to the database.
   *
   * https://docs.nestjs.com/recipes/prisma
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
   /** Prisma interferes with NestJS enableShutdownHooks.
   * Prisma listens for shutdown signals and will call process.exit()
   * before your application shutdown hooks fire.
   *
   * https://docs.nestjs.com/recipes/prisma
   */
   async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}
