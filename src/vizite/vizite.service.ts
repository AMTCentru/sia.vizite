import { Injectable } from '@nestjs/common';
import { ViziteAmsModel } from './viziteAMS.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateViziteAMSDto } from './create.dto';

@Injectable()
export class ViziteService {
    constructor(
        @InjectModel(ViziteAmsModel)
        private readonly viziteAmsRepository: typeof ViziteAmsModel
    ) {}

    async create(dto: CreateViziteAMSDto){
        try{
            await this.viziteAmsRepository.create(dto)
        } catch (e){
            console.log(e)
        }
    }
}
