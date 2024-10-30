import { BadRequestException, Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as path from 'path';
import puppeteer, { Browser} from 'puppeteer';
import { SiaampVizite } from './vizite.service';

@Injectable()
export class SiaampService {

    private browser: Browser;

    constructor(private viziteService : SiaampVizite) {}

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
            await page.screenshot({ path: filePath });

            // Read the screenshot file
            const screenshotBuffer = await readFile(filePath);
            return screenshotBuffer;

        } catch (error) {
            console.error('Error occurred:', error);
            throw new BadRequestException('An error occurred while processing your request.');
        } 
    }

    async startSiaVizite(){      
        try {
            const page = await this.browser.newPage();
            //await page.goto('https://sia.amp.md/siaamp/');
            await page.goto('https://sia.amp.md/siaamp/mpassUsers.html');  
            const operatorStatistica = ".ui-datagrid-row>td:nth-child(3)>div>div>form>input:nth-child(6)"
            await page.waitForSelector(operatorStatistica)
            await page.click(operatorStatistica)

            await this.viziteService.Pas1(page)
            await this.viziteService.Pas2(page)

        } 
        catch (error) {
            console.log(error)
            return `Error while scraping job listings: ${error}`;
        }
    }
}
