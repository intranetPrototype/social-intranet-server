import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const operationIdFactory = (
    controllerKey: string,
    methodKey: string
  ) => `${methodKey}`;

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Social intranet server')
    .setDescription('API description of the social intranet server API')
    .setVersion('0.0-beta')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
