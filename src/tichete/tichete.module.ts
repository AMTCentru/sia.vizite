import { Module } from '@nestjs/common';
import { TicheteController } from './tichete.controller';
import { TicheteService } from './tichete.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TicheteStatModel } from './tichete.model';

@Module({
  controllers: [TicheteController],
  providers: [TicheteService],
  imports:[
    SequelizeModule.forFeature([TicheteStatModel])
  ],
  exports:[TicheteService]
})
export class TicheteModule {}
