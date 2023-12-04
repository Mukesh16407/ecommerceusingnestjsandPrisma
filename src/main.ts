import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExceptionInterceptor } from './common/interceptors/exception.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  app.useGlobalInterceptors(new ExceptionInterceptor())
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

  await app.listen(3000);
}
bootstrap();