import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Back-Prueba API')
    .setDescription(
      'API documentation for Back-Prueba project with Clean Architecture',
    )
    .setVersion('1.0')
    .addTag('products', 'Products management endpoints')
    .addTag('transactions', 'Transaction processing endpoints')
    .addTag('cards', 'Card tokenization endpoints')
    .addTag('webhooks', 'Webhook notification endpoints')
    .addTag('customers', 'Customer management endpoints')
    .addTag('deliveries', 'Delivery management endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(
    `Swagger documentation available at: ${await app.getUrl()}/api/docs`,
  );
}

void bootstrap();
