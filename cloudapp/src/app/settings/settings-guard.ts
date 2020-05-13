import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { SettingsComponent } from "./settings.component";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class SettingsGuard implements CanDeactivate<SettingsComponent> {
  constructor(
    private translate: TranslateService
  ) {}

  canDeactivate(component: SettingsComponent): boolean {
    if(component.form.dirty) {
      return confirm(this.translate.instant('Settings.Discard'));
    }
    return true;
  }
}
