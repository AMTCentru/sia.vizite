import { Response } from 'express';
import { Controller, Get, Res, HttpStatus, Query} from '@nestjs/common';
import { SiaampService } from './siaamp.service';

@Controller('siaamp')
export class SiaampController {

    constructor(
        private service: SiaampService
    ) {}

    @Get('logareSiaVizite')
    async logareSiaVizite(@Res() res: Response): Promise<void> {
        try {
            const data = await this.service.logareSiaVizite(); // Call the service method
            res.setHeader('Content-Type', 'image/png'); // Set the content type for a PNG image
            res.status(HttpStatus.OK).send(data); // Send the image buffer as response
        } catch (error) {
            console.error('Error during login:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred during login.',
            });
        }
    }
    @Get('startSiaVizite')
    async startSiaVizite(
        @Query('perioadaStart') perioadaStart: string,
        @Query('perioadaFinish') perioadaFinish: string
    ){
        return await this.service.startSiaVizite(perioadaStart,perioadaFinish)
    }
}
