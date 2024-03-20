import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('root');
  // Para API-Rest
  //const app = await NestFactory.create(AppModule);
  // Para Micoservicios
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      //transport: Transport.TCP,
      transport: Transport.NATS,
      options: {
        //port: envs.port,
        //servers: [`nats://localhost:4222`],
        servers: envs.natServers,
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  //await app.listen(envs.port);
  await app.listen();
  //console.log(`App run on port ${envs.port}`);
  logger.log(`Products microservice running on port ${envs.port}`);
}
bootstrap();
