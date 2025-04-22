import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  const config = new DocumentBuilder()
  .setTitle('Prueba tecnica')
  .setDescription('TODO TASK')
  .setVersion('1.0')
  .addTag('TASK')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors()

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
});
