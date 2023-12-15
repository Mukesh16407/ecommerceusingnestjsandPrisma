import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExceptionInterceptor } from './common/interceptors/exception.interceptor';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { loggerWinstonConfig } from './config/logger';
import { useContainer } from 'class-validator';



async function bootstrap() {
   const logger = new Logger('worker');
  const app = await NestFactory.create(AppModule,{
    logger:WinstonModule.createLogger({
      format:winston.format.combine(
        process.env.JSON_LOG_OFF ? winston.format.simple():winston.format.json(),
        winston.format.errors({stack:true}),
        ),
        level:loggerWinstonConfig(),
        transports:[new winston.transports.Console()]
    }),


  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  app.enableShutdownHooks()
  app.useGlobalInterceptors(new ExceptionInterceptor());
  const config = new DocumentBuilder()
    .setTitle('Ecommerce')
    .setDescription('The Ecommerce API description')
    .setVersion('0.1')
    .addBearerAuth()
    .addTag('authentication')
    .addTag('user')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'eCommerce Swagger API',
  });
  useContainer(app.select(AppModule),{fallbackOnErrors:true})
  // await app.init();
  logger.log("worker Initialized")
  await app.listen(3000);
}
bootstrap();
