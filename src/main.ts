import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);
  
  // Permite doar unui anumit domeniu să acceseze serverul
  app.enableCors({
    origin: '*', // Domeniul pe care îl permiți
    methods: 'GET, POST', // Metodele permise
    allowedHeaders: 'Content-Type, Authorization', // Capetele permise
  });

  await app.listen(PORT, () => console.log (`Server started on port = ${PORT}`))
}
bootstrap();
