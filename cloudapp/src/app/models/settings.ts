import { CloudAppRestService, CloudAppSettingsService } from "@exlibris/exl-cloudapp-angular-lib";
import { forkJoin, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { sortByProperty } from "../utils";

export class Settings {
  rates: {
    code: string,
    description: string
    percent: number
  }[] = []
}

export const getSettings = (
  restService: CloudAppRestService, 
  settingsService: CloudAppSettingsService ) => {
  return forkJoin(
    restService.call('/conf/code-tables/InvoiceLinesTypes'),
    settingsService.get()
  )
  .pipe( 
    map( results => {
      let settings: Settings = Object.keys(results[1]).length == 0 ? new Settings() : results[1];
      settings.rates = results[0].row.map(row=>{
        const savedRow = settings.rates.find( i => i.code === row.code );
        return { code: row.code, description: row.description, 
          percent: savedRow && savedRow.percent }
        }).sort(sortByProperty('description'));
      return settings;
    })
  );
}