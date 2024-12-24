import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { Page } from 'puppeteer';
import { CreateTicheteDto } from 'src/tichete/createTichete.dto';
import { TicheteService } from 'src/tichete/tichete.service';

@Injectable()
export class statisticaTicheteService {

  constructor (private ticheteService: TicheteService) {}
  
  async delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  async Pas1(page: Page){
    
    const clickStatistica = "#appMenuForm\\:tabMenuModules > ul > li:nth-child(3) > a"
    await page.waitForSelector(clickStatistica)
    await page.click(clickStatistica)
    
    const hoverAltele = ".subMenuStatistics:nth-child(4)"
    await this.isHidden(page)
    await page.waitForSelector(hoverAltele)
    await page.hover(hoverAltele)
    
    const clickTichete = ".subMenuStatistics:nth-child(4)>ul>li:nth-child(2)"
    await this.isHidden(page)
    await page.waitForSelector(clickTichete)
    await page.click(clickTichete)
    console.log('Final Pas1')

    await page.goto('https://sia.amp.md/siaamp/');
    const buttonCurataFiltre = 'body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > table:nth-of-type(2) > tbody > tr > td:nth-of-type(3) > button'
    await page.waitForSelector(buttonCurataFiltre)
    await page.click(buttonCurataFiltre); // Perform the click action
  }

  async Pas2(page: Page,perioadaStart:string,perioadaFinish:string){

    await this.isHidden(page)
    console.log('Start Pas2')

    console.log(perioadaStart)

    await page.evaluate((perioadaStart) => {
      const startDate = "#contentform\\:panelGridSearchFilterId>tbody>tr:nth-child(4)>td:nth-child(2)>span>input"
      const select = document.querySelector(startDate) as HTMLSelectElement;
      select.value = perioadaStart; // Set the desired value
    }, perioadaStart);

    await page.evaluate((perioadaFinish) => {
      const StopDate = "#contentform\\:panelGridSearchFilterId>tbody>tr:nth-child(4)>td:nth-child(4)>span>input"
      const select = document.querySelector(StopDate) as HTMLSelectElement;
      select.value = perioadaFinish; // Set the desired value
    }, perioadaFinish);

    let k = 2
    while (k < 4) {
      console.log(`k = ${k}`);
      await this.isHidden(page)
      const clickLiSubdiv = "#contentform\\:organizationalUnitId > div.ui-selectonemenu-trigger.ui-state-default.ui-corner-right > span"
      await page.waitForSelector(clickLiSubdiv)
      await page.click(clickLiSubdiv)
      await this.isHidden(page)

      let selectSubdiv = `#contentform\\:organizationalUnitId_panel > div > ul > li:nth-child(${k})`
      await page.waitForSelector(selectSubdiv)
      await page.click(selectSubdiv) 
      await this.isHidden(page)

      const clickButonCauta = "body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > table:nth-of-type(2) > tbody > tr > td:nth-of-type(1) > button > span:nth-of-type(2)";
      await page.waitForSelector(clickButonCauta);
      await page.click(clickButonCauta);
      await this.isHidden(page)

      await this.dataTable(page);
      k++
    }
  }   

  async dataTable(page: Page) {

    // Check if the table exists
    const allTableExists = await page.evaluate(() => {
      const rows = document.querySelectorAll('body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > div > div:nth-of-type(2) > table > tbody > tr');
      return rows.length > 0;
    });

    if (allTableExists === true) {
      // Get the total number of items
      const text = await page.evaluate(() => {
          return document.querySelector('.ui-paginator-current').textContent;
      });

      const match = text.match(/din (\d+)/);
      const total = match[1]; // Default to '0' if no match found
      if(total == '0'){
        return null
      }
      console.log(total); // Log the total
      // Change paginator value
      const changeValuePaginator = "body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > div > div:nth-of-type(1) > select > option:nth-of-type(2)";
      await page.waitForSelector(changeValuePaginator);

      await page.evaluate((selector, value) => {
          const select = document.querySelector(selector) as HTMLSelectElement;
          if (select) {
              select.value = value; // Set the desired value
              select.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
          }
      }, changeValuePaginator, total);

      // Click the paginator to refresh data
      const clickPaginator = "body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > div > div:nth-of-type(1) > select";
      await this.isHidden(page);
      await page.waitForSelector(clickPaginator);
      await page.click(clickPaginator);

      await this.isHidden(page)
      const dropdown = await page.$(clickPaginator); // Use the same selector for the dropdown
      await dropdown.select(total); // Use the value of the option you want to select

      await this.isHidden(page); // Ensure the page is updated after the click
      const tabelReceptie = await page.$eval("body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > div > div:nth-of-type(2)", el => el.innerHTML);
      
      const subdiv = await page.evaluate(()=>{
        return document.querySelector('body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > table:nth-of-type(1) > tbody > tr:nth-of-type(1) > td:nth-of-type(2) > div > label').textContent.trim()
      });
      console.log(subdiv); // Outputs: Cardiolog


      // Creează un array de Promises
      const promises = [];

      // Load the table data with Cheerio
      const $$ = cheerio.load(tabelReceptie);
      const rows = $$('tr');  // Selectează toate rândurile
      for (let i = 0; i < rows.length; i++) {
        const element = rows[i];
        process.stdout.write(`Număr de rind:  ${i}\r`);
        const cells = $$(element).find('td');
        if (cells.length) {
          const codDiagnostic = $$(cells[0]).text().trim();
          const formatDate = (dateString) => {
            const [day, month, year] = dateString.split('/');
            return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
          };
          const diagnostic = $$(cells[1]).text().trim();
          const dataAdresarii = formatDate($$(cells[2]).text().trim());
          const numePrenumePacient = $$(cells[3]).text().trim();
          const Idnp = $$(cells[4]).text().trim();
          const idnpPacient = Idnp.length === 12 ? `0${Idnp}` : Idnp;
          const sexPacient = $$(cells[5]).text().trim();
          const virsta = parseInt($$(cells[6]).text().trim());
          const dataNasterePacient = formatDate($$(cells[7]).text().trim());
          const adresaPacient = $$(cells[8]).text().trim();
          const medicDeFamilie = $$(cells[9]).text().trim();
          const efectuatDeMeidic = $$(cells[10]).text().trim();
          const cazNou = $$(cells[11]).text().trim();
          const dispensar = $$(cells[12]).text().trim();

          // Crează obiectul DTO pentru vizita AMS
          const receptieDto = new CreateTicheteDto();
          receptieDto.subdiv = subdiv;
          receptieDto.diagnostic = diagnostic;
          receptieDto.medicDeFamilie = medicDeFamilie;
          receptieDto.nrRow = i;
          receptieDto.dataAdresarii = dataAdresarii;
          receptieDto.idnpPacient = idnpPacient;
          receptieDto.numePrenumePacient = numePrenumePacient;
          receptieDto.dataNasterePacient = dataNasterePacient;
          receptieDto.sexPacient = sexPacient;
          receptieDto.virsta = virsta;
          receptieDto.adresaPacient = adresaPacient;
          receptieDto.efectuatDeMeidic = efectuatDeMeidic;
          receptieDto.cazNou = cazNou;
          receptieDto.dispensar = dispensar;
          receptieDto.codDiagnostic = codDiagnostic;

          // Adaugă fiecare operațiune într-un array de Promises
          promises.push(this.ticheteService.create(receptieDto));
        }
      };
      // Așteaptă finalizarea tuturor promisiunilor
      Promise.all(promises)
      .then((results) => {
        console.log(`Toate operațiunile au fost finalizate cu succes: ${results.length}`);
      })
      .catch((error) => {
        console.error('Au existat erori în timpul procesării:', error);
      });
      console.log('\n')
    }
    return null
  }  
  async isHidden(page: Page) {
    const selector ='body > div:nth-child(5)'
    await page.waitForFunction((selector) => {
      const element = document.querySelector(selector);
      return element && element.getAttribute('style').includes('hidden') 
    },{timeout:120000},selector);
  }
}