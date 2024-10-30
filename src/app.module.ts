import { Module } from '@nestjs/common';
import { SiaampModule } from './siaamp/siaamp.module';
import { ViziteModule } from './vizite/vizite.module';
import { ViziteAmsModel } from './vizite/viziteAMS.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    SequelizeModule.forRoot({
      logging: false,
      dialect: 'mssql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [
        ViziteAmsModel,
      ],
    }),
    SiaampModule, ViziteModule
  ],
})
export class AppModule {}
