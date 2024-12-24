import { Injectable } from '@nestjs/common';
import { TicheteStatModel } from './tichete.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTicheteDto } from './createTichete.dto';

@Injectable()
export class TicheteService {

    constructor(
        @InjectModel(TicheteStatModel)
        private readonly ticheteRepository: typeof TicheteStatModel
    ) {}

    async create(dto: CreateTicheteDto){
        try{
            await this.ticheteRepository.create(dto)
        } catch (e){
            console.log(e)
        }
    }

}
