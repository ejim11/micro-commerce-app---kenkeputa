import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ErrorHandlingInterceptor } from './common/interceptors/error-handling/error-handling.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Register global interceptor for automatic error handling
  app.useGlobalInterceptors(new ErrorHandlingInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,

      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api/v1');

  // swagger config
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Micro-Commerce app API Documentation')
    .setDescription('Use the base API Url as http://localhost:3001')
    .setTermsOfService('http://localhost:3001/terms-of-service')
    .setContact(
      'Ejim Favour',
      'https://jimmydev-portfolio.vercel.app/',
      'favourejim56@gmail.com',
    )
    .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3001', 'Local Server')
    .setVersion('1.0.0')
    .build();

  // instantiate the doc
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // setup
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(3001);
}
bootstrap();
