import { Module } from '@nestjs/common';
import { SiaampController } from './siaamp.controller';
import { SiaampService } from './siaamp.service';
import { SiaampViziteAMS } from './viziteAMS.service';
import { ViziteService } from 'src/vizite/vizite.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ViziteAmsModel } from 'src/vizite/viziteAMS.model';
import { SiaampViziteAMP } from './viziteAMP.service';
import { TicheteService } from 'src/tichete/tichete.service';
import { statisticaTicheteService } from './tichete.service';
import { TicheteStatModel } from 'src/tichete/tichete.model';

@Module({
  controllers: [SiaampController],
  providers: [SiaampService,SiaampViziteAMS,SiaampViziteAMP,ViziteService,TicheteService,statisticaTicheteService],
  imports:[SequelizeModule.forFeature([ViziteAmsModel,TicheteStatModel])]
})
export class SiaampModule {}
