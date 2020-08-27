import { CloudAppRestService, CloudAppSettingsService } from "@exlibris/exl-cloudapp-angular-lib";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { sortByProperty } from "../utils";
import { Injectable } from "@angular/core";

export class Settings {
  rates: {
    code: string,
    description: string
    percent: number
  }[] = []
}

@Injectable()
export class SettingsService {

  constructor(
    private restService: CloudAppRestService,
    private settingsService: CloudAppSettingsService
  ) { }

  getSettings() {
    return forkJoin([
      this.restService.call('/conf/code-tables/InvoiceLinesTypes'),
      this.settingsService.get()
    ])
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

  set(settings: any) {
    return this.settingsService.set(settings);
  }
}
