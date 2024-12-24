import { BadRequestException, Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as path from 'path';
import puppeteer, { Browser} from 'puppeteer';
import { SiaampViziteAMS } from './viziteAMS.service';
import { SiaampViziteAMP } from './viziteAMP.service';
import { statisticaTicheteService } from './tichete.service';

@Injectable()
export class SiaampService {

    private browser: Browser;

    constructor(
        private viziteAmsService : SiaampViziteAMS,
        private viziteAmpService : SiaampViziteAMP,
        private ticheteService : statisticaTicheteService
    ) {}

    async logareSiaVizite(): Promise<Buffer> {
        try {
            console.log('Launching Puppeteer...');
            this.browser = await puppeteer.launch({
                executablePath: '/usr/bin/google-chrome-stable',
                args: ['--no-sandbox'],
                headless: false,
                defaultViewport: { width: 1920, height: 1080 },
            });

            const page = await this.browser.newPage();
            await page.goto('https://sia.amp.md/siaamp/');

            const butonLogare = "#formMPass > div > div:nth-child(2) > a"
            await page.waitForSelector(butonLogare)
            await page.click(butonLogare)
            const qr = "#evosign-desktop"
            await page.waitForFunction((selector) => {
                return document.querySelector(selector) !== null;
            }, {}, qr);
            
            // Take a screenshot and save it to the specified path
            const filePath = path.resolve(__dirname, '../../screenshot.png');
            const boundingBox = await (await page.$(qr)).boundingBox();
            await page.screenshot({ 
                path: filePath,
                clip: {
                    x: boundingBox.x,
                    y: boundingBox.y,
                    width: boundingBox.width,
                    height: boundingBox.height,
                } 
             });

            // Read the screenshot file
            const screenshotBuffer = await readFile(filePath);
            return screenshotBuffer;

        } catch (error) {
            console.error('Error occurred:', error);
            throw new BadRequestException('An error occurred while processing your request.');
        } 
    }

    async startSiaViziteAMS(perioadaStart:string,perioadaFinish:string): Promise<Buffer> {      
        const page = await this.browser.newPage();
        try {
            await page.goto('https://sia.amp.md/siaamp/mpassUsers.html');  
            const operatorStatistica = ".ui-datagrid-row>td:nth-child(3)>div>div>form>input:nth-child(6)"
            await page.waitForSelector(operatorStatistica)
            await page.click(operatorStatistica)

            await this.viziteAmsService.Pas1(page)

            await this.viziteAmsService.Pas2(page,perioadaStart,perioadaFinish)

        } 
        catch (error) {
            console.log(error)
            // Take a screenshot and save it to the specified path
            const filePath = path.resolve(__dirname, '../../viziteAmsService.png');
            await page.screenshot({ path: filePath });
            const screenshotBuffer = await readFile(filePath);
            return screenshotBuffer;
        }
    }

    async startSiaViziteAMP(perioadaStart:string,perioadaFinish:string): Promise<Buffer> {      
        const page = await this.browser.newPage();
        try {
            await page.goto('https://sia.amp.md/siaamp/mpassUsers.html');  
            const operatorStatistica = ".ui-datagrid-row>td:nth-child(3)>div>div>form>input:nth-child(6)"
            await page.waitForSelector(operatorStatistica)
            await page.click(operatorStatistica)

            await this.viziteAmpService.Pas1(page)

            await this.viziteAmpService.Pas2(page,perioadaStart,perioadaFinish)

        } 
        catch (error) {
            console.log(error)
            // Take a screenshot and save it to the specified path
            const filePath = path.resolve(__dirname, '../../viziteAmpService.png');
            await page.screenshot({ path: filePath });
            const screenshotBuffer = await readFile(filePath);
            return screenshotBuffer;
        }
    }

    async startSiaTicheteStat(perioadaStart:string,perioadaFinish:string): Promise<Buffer> {      
        const page = await this.browser.newPage();
        try {
            await page.goto('https://sia.amp.md/siaamp/mpassUsers.html');  
            const operatorStatistica = ".ui-datagrid-row>td:nth-child(3)>div>div>form>input:nth-child(6)"
            await page.waitForSelector(operatorStatistica)
            await page.click(operatorStatistica)

            await this.ticheteService.Pas1(page)

            await this.ticheteService.Pas2(page,perioadaStart,perioadaFinish)
        } 
        catch (error) {
            console.log(error)
            // Take a screenshot and save it to the specified path
            const filePath = path.resolve(__dirname, '../../startSiaTicheteStat.png');
            await page.screenshot({ path: filePath });
            const screenshotBuffer = await readFile(filePath);
            return screenshotBuffer;
        }
    }
}
