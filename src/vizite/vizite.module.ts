import { Module } from '@nestjs/common';
import { ViziteController } from './vizite.controller';
import { ViziteService } from './vizite.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ViziteAmsModel } from './viziteAMS.model';

@Module({
  controllers: [ViziteController],
  providers: [ViziteService],
  imports:[
    SequelizeModule.forFeature([ViziteAmsModel])
  ],
  exports:[ViziteService]
})
export class ViziteModule {}
