import { Module } from '@nestjs/common';
import { SiaampController } from './siaamp.controller';
import { SiaampService } from './siaamp.service';
import { SiaampVizite } from './vizite.service';
import { ViziteService } from 'src/vizite/vizite.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ViziteAmsModel } from 'src/vizite/viziteAMS.model';

@Module({
  controllers: [SiaampController],
  providers: [SiaampService,SiaampVizite,ViziteService],
  imports:[SequelizeModule.forFeature([ViziteAmsModel])]
})
export class SiaampModule {}
