import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { Page } from 'puppeteer';
import { CreateViziteAMSDto } from 'src/vizite/create.dto';
import { ViziteService } from 'src/vizite/vizite.service';

@Injectable()
export class SiaampVizite {

    constructor (
      private viziteAmsService: ViziteService
    ) {}
    async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async Pas1(page: Page){
        await page.goto('https://sia.amp.md/siaamp/');
        const buttonCurataFiltre = 'body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > table:nth-of-type(2) > tbody > tr > td:nth-of-type(2) > button'
        await page.waitForSelector(buttonCurataFiltre)
        await page.click(buttonCurataFiltre); // Perform the click action
  
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
    }
    async Pas2(page: Page){
      // await page.goto('https://sia.amp.md/siaamp/');  
      await this.isHidden(page)
      console.log('Start Pas2')

      const perioadaStart = "01/10/2024";
      const perioadaFinish = "31/10/2024";
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
      let i = 2, j = 2, k = 2;

        try {
            for (i; i <= 3; i++) {
                try {
                    const clickLISubDiv = `body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > table:nth-of-type(1) > tbody > tr:nth-of-type(1) > td:nth-of-type(2) > div > div:nth-of-type(3)`;
                    await page.waitForSelector(clickLISubDiv);
                    await page.click(clickLISubDiv);
                    await this.isHidden(page);
                    await this.delay(1000);

                    let clickSubDiv = `body > div:nth-of-type(12) > div > ul > li:nth-of-type(${i})`;
                    await page.waitForSelector(clickSubDiv);
                    await page.click(clickSubDiv);
                    await this.isHidden(page);

                    const NumberSpecialite = await page.evaluate(() => {
                        return document.querySelectorAll("body > div:nth-of-type(13) > div > ul > li").length;
                    });

                    for (j; j < NumberSpecialite + 1; j++) {
                        try {
                            const clickLISpecialitate = `body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > table:nth-of-type(1) > tbody > tr:nth-of-type(2) > td:nth-of-type(2) > div > div:nth-of-type(3)`;
                            await page.waitForSelector(clickLISpecialitate);
                            await page.click(clickLISpecialitate);
                            await this.isHidden(page);

                            let clickSpecialitate = `body > div:nth-of-type(13) > div > ul > li:nth-of-type(${j})`;
                            await page.waitForSelector(clickSpecialitate);
                            await page.click(clickSpecialitate);
                            await this.isHidden(page);

                            const NumberMedici = await page.evaluate(() => {
                                return document.querySelectorAll("body > div:nth-of-type(14) > div > ul > li").length;
                            });

                            for (k; k < NumberMedici + 1; k++) {
                                try {
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

                                    await this.delay(2000);
                                    await this.isHidden(page);

                                    const dateTabelData = await this.dataTable(page);
                                    if (dateTabelData != null) {
                                        for (const el of dateTabelData) {
                                            const receptieDto = new CreateViziteAMSDto();
                                            receptieDto.subdiv = el.subdiv;
                                            receptieDto.specialitate = el.specialitate;
                                            receptieDto.numeMedic = el.numeMedic;
                                            receptieDto.nrRow = el.nrRow;
                                            receptieDto.dataAdresarii = el.dataAdresarii;
                                            receptieDto.idnpPacient = el.idnpPacient;
                                            receptieDto.numePrenumePacient = el.numePrenumePacient;
                                            receptieDto.dataNasterePacient = el.dataNasterePacient;
                                            receptieDto.sexPacient = el.sexPacient;
                                            receptieDto.statutPacient = el.statutPacient;
                                            receptieDto.adresaPacient = el.adresaPacient;
                                            receptieDto.diagnosticPacient = el.diagnosticPacient;
                                            receptieDto.tipVizita = el.tipVizita;

                                            try {
                                                await this.viziteAmsService.create(receptieDto);
                                                console.log(receptieDto);
                                            } catch (error) {
                                                console.error('Error creating vizite AMS:', error);
                                            }
                                        }
                                    }

                                } catch (error) {
                                    console.error(`Error at k=${k}:`, error);
                                    // Reset k to allow retrying the same doctor
                                    k--; // Decrement k to retry the same medic
                                }
                            }
                        } catch (error) {
                            console.error(`Error at j=${j}:`, error);
                            // Reset j to allow retrying the same specialty
                            j--; // Decrement j to retry the same specialitate
                        }
                    }
                } catch (error) {
                    console.error(`Error at i=${i}:`, error);
                    // Reset i to allow retrying the same subdiv
                    i--; // Decrement i to retry the same subdiv
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }   
 
    async dataTable(page: Page) {
      let datePacient = [];
  
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
        
        await this.delay(2000)
        await this.isHidden(page); // Ensure the page is updated after the click
        const tabelReceptie = await page.$eval("body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(3) > div:nth-of-type(2) > div > div:nth-of-type(2)", el => el.innerHTML);
        
        const subdiv = await page.evaluate(()=>{
          return document.querySelector('body > div:nth-of-type(5) > form > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > table:nth-of-type(1) > tbody > tr:nth-of-type(1) > td:nth-of-type(2) > div > label').textContent.trim()
        });
        console.log(subdiv); // Outputs: Cardiolog

        const specialitate = await page.evaluate(()=>{
          return document.querySelector('#contentform\\:specialitySelected_label').textContent.trim()
        });
        console.log(specialitate); // Outputs: Cardiolog

        const numeMedic = await page.evaluate(()=>{
          return document.querySelector('#contentform\\:ouSelected_label').textContent.trim();
        })
        console.log(numeMedic); // Outputs: GHENCIU ION


        // Load the table data with Cheerio
        const $$ = cheerio.load(tabelReceptie);
        $$('tr').each((_, element) => {
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

              datePacient.push({
                subdiv,
                specialitate ,
                numeMedic,
                nrRow,
                dataAdresarii,
                idnpPacient,
                numePrenumePacient,
                dataNasterePacient,
                sexPacient,
                statutPacient,
                adresaPacient,
                diagnosticPacient,
                tipVizita,
              })  
            }
        });
        return datePacient; // Return the collected patient data
      }
      return null
  }  
  async isHidden(page: Page) {
    let value;
    let attempts = 0; // Track the number of attempts
  
    do {
      await this.delay(1000); // Wait for a short duration
      value = await page.evaluate(() => {
        const element = document.querySelector('body > div:nth-child(5)');
        return element && element.getAttribute('style') 
          ? element.getAttribute('style').includes('hidden') 
          : false; // Check if the element exists and has the hidden style
      });
      attempts++; // Increment the attempts counter
  
      // Reload the page if the limit of attempts is exceeded
      if (attempts > 10) {
        await page.reload();
        console.log('Reloading page due to hidden element');
        attempts = 0; // Reset attempts after reloading
      }
    } while (value !== true); // Continue until the element is no longer hidden
    return value; // Return the final state
  }
}