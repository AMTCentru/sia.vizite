import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { Page } from 'puppeteer';
import { CreateViziteAMSDto } from 'src/vizite/createAMS.dto';
import { ViziteService } from 'src/vizite/vizite.service';

@Injectable()
export class SiaampViziteAMS {

  constructor (private viziteAmsService: ViziteService) {}
  
  async delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  async retryOperation(func: Function, page : Page) {
    let attempt = 0;
    let maxAttempts = 3
    while (attempt < maxAttempts) {
        try {
            // Execută funcția
            await func();
            return; // Dacă nu a apărut nicio eroare, ieșim din loop
        } catch (error) {
            console.log(`Attempt ${attempt + 1} failed: ${error.message}`);
            attempt++;
            if (attempt < maxAttempts) {
                console.log(`Retrying `);
                await this.isHidden(page)
            }
        }
    }
    console.log('Max attempts reached. Operation failed.');
  }
  async Pas1(page: Page){
    
    const clickStatistica = "#appMenuForm\\:tabMenuModules > ul > li:nth-child(3) > a"
    await page.waitForSelector(clickStatistica)
    await page.click(clickStatistica)
    
    const hoverRapoarteCNAM = ".subMenuStatistics:nth-child(2)"
    await this.isHidden(page)
    await page.waitForSelector(hoverRapoarteCNAM)
    await page.hover(hoverRapoarteCNAM)
    
    const click1_03 = ".subMenuStatistics:nth-child(2)>ul>li:nth-child(2)"
    await this.isHidden(page)
    await page.waitForSelector(click1_03)
    await page.click(click1_03)
    console.log('Final Pas1')

    await page.goto('https://sia.amp.md/siaamp/');
    const buttonCurataFiltre = 'body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > table:nth-of-type(2) > tbody > tr > td:nth-of-type(2) > button'
    await page.waitForSelector(buttonCurataFiltre)
    await page.click(buttonCurataFiltre); // Perform the click action
  }

  async Pas2(page: Page,perioadaStart:string,perioadaFinish:string){

    await this.isHidden(page)
    console.log('Start Pas2')

    console.log(perioadaStart)

    await page.evaluate((perioadaStart) => {
      const startDate = "#contentform\\:calendarStartDateId_input"
      const select = document.querySelector(startDate) as HTMLSelectElement;
      select.value = perioadaStart; // Set the desired value
    }, perioadaStart);


    await page.evaluate((perioadaFinish) => {
      const StopDate = "#contentform\\:calendarEndDateId_input"

      const select = document.querySelector(StopDate) as HTMLSelectElement;
      select.value = perioadaFinish; // Set the desired value
    }, perioadaFinish);

    let i = 3, j = 11, k = 3

    for (i; i <= 3; i++) {
      console.log(`i = ${i}`)

      const NumberSpecialite = await this.subdiv(page,i)

      while (j < NumberSpecialite+1) {
        console.log(`j = ${j}`);

        const NumberMedici = await this.specialitate(page, j)

        const specialitate = await page.evaluate(()=>{
          return document.querySelector('#contentform\\:specialitySelected_label').textContent.trim()
        });
        if(specialitate === 'Alta specialitate'){
          return null
        }
        console.log(specialitate); // Outputs: Cardiolog

        while (k < NumberMedici+1) {
          console.log(`k = ${k}`);

          await this.retryOperation(async () => {
            // Codul tău care ar putea să dea eroare
            await this.medicspecialist(page, k)
          }, page); // Încearcă de 3 ori, cu 2 secunde între încercări
          

          await this.dataTable(page);
          k++
        }
        k = 2
        j++
      }
      j = 2 
    }
  }   

  async subdiv(page: Page, i : number){
    const clickLISubDiv = `body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > table:nth-of-type(1) > tbody > tr:nth-of-type(1) > td:nth-of-type(2) > div > div:nth-of-type(3)`;
    await page.waitForSelector(clickLISubDiv);
    await page.click(clickLISubDiv);
    await this.isHidden(page);

    let clickSubDiv = `body > div:nth-of-type(12) > div > ul > li:nth-of-type(${i})`;
    await page.waitForSelector(clickSubDiv);
    await page.click(clickSubDiv);
    await this.isHidden(page);

    return await page.evaluate(() => {
        return document.querySelectorAll("body > div:nth-of-type(13) > div > ul > li").length;
    });
  }
  async specialitate(page : Page, j : number){

    const clickLISpecialitate = `body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > table:nth-of-type(1) > tbody > tr:nth-of-type(2) > td:nth-of-type(2) > div > div:nth-of-type(3)`;
    await page.waitForSelector(clickLISpecialitate);
    await page.click(clickLISpecialitate);
    await this.isHidden(page);

    let clickSpecialitate = `body > div:nth-of-type(13) > div > ul > li:nth-of-type(${j})`;
    await page.waitForSelector(clickSpecialitate);
    await page.click(clickSpecialitate);
    await this.isHidden(page);

    return await page.evaluate(() => {
        return document.querySelectorAll("body > div:nth-of-type(14) > div > ul > li").length;
    });
  }
  async medicspecialist(page : Page, k : number){

    await this.isHidden(page);
    const clickLIMedic = `body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > table:nth-of-type(1) > tbody > tr:nth-of-type(3) > td:nth-of-type(2) > div > div:nth-of-type(3)`;
    await page.waitForSelector(clickLIMedic);
    await page.click(clickLIMedic);

    let clickMedic = `body > div:nth-of-type(14) > div > ul > li:nth-of-type(${k})`;
    await page.waitForSelector(clickMedic);
    await page.click(clickMedic);
    await this.isHidden(page);

    const clickButonCauta = "body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > table:nth-of-type(2) > tbody > tr > td:nth-of-type(1) > button > span:nth-of-type(2)";
    await page.waitForSelector(clickButonCauta);
    await page.click(clickButonCauta);
    await this.isHidden(page);

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

      const specialitate = await page.evaluate(()=>{
        return document.querySelector('#contentform\\:specialitySelected_label').textContent.trim()
      });
      if(specialitate === 'Alta specialitate'){
        return null
      }
      console.log(specialitate); // Outputs: Cardiolog

      const numeMedic = await page.evaluate(()=>{
        return document.querySelector('#contentform\\:ouSelected_label').textContent.trim();
      })
      console.log(numeMedic); // Outputs: GHENCIU ION


      // Load the table data with Cheerio
      const $$ = cheerio.load(tabelReceptie);
      const rows = $$('tr');  // Selectează toate rândurile
      for (let i = 0; i < rows.length; i++) {
        const element = rows[i];
        process.stdout.write(`Număr de rind:  ${i}\r`);
        const cells = $$(element).find('td');
        if (cells.length) {
          const nrRow = $$(cells[0]).text().trim();
          const formatDate = (dateString) => {
            const [day, month, year] = dateString.split('/');
            return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
          };
          const dataAdresarii = formatDate($$(cells[1]).text().trim());
          const Idnp = $$(cells[2]).text().trim();
          const idnpPacient = Idnp.length === 12 ? `0${Idnp}` : Idnp;
          const numePrenumePacient = $$(cells[3]).text().trim();
          const dataNasterePacient = formatDate($$(cells[4]).text().trim());
          const sexPacient = $$(cells[5]).text().trim();
          const statutPacient = $$(cells[6]).text().trim();
          const adresaPacient = $$(cells[7]).text().trim();
          const diagnosticPacient = $$(cells[8]).text().trim();
          const tipVizita = $$(cells[9]).text().trim();

          // Crează obiectul DTO pentru vizita AMS
          const receptieDto = new CreateViziteAMSDto();
          receptieDto.subdiv = subdiv;
          receptieDto.specialitate = specialitate;
          receptieDto.numeMedic = numeMedic;
          receptieDto.nrRow = nrRow;
          receptieDto.dataAdresarii = dataAdresarii;
          receptieDto.idnpPacient = idnpPacient;
          receptieDto.numePrenumePacient = numePrenumePacient;
          receptieDto.dataNasterePacient = dataNasterePacient;
          receptieDto.sexPacient = sexPacient;
          receptieDto.statutPacient = statutPacient;
          receptieDto.adresaPacient = adresaPacient;
          receptieDto.diagnosticPacient = diagnosticPacient;
          receptieDto.tipVizita = tipVizita;

          await this.viziteAmsService.create(receptieDto);
        }
      };
      console.log('\n')
    }
    return null
  }  
  async isHidden(page: Page) {
    const selector ='body > div:nth-child(5)'
    await page.waitForFunction((selector) => {
      const element = document.querySelector(selector);
      return element && element.getAttribute('style').includes('hidden') 
    },{},selector);
  }
}