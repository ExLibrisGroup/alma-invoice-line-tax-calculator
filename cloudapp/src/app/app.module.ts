import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, getTranslateModule, AlertModule } from '@exlibris/exl-cloudapp-angular-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';
import { SelectEntitiesComponent } from './select-entities/select-entities.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { SettingsService } from './models/settings.service';

@NgModule({
   declarations: [
      AppComponent,
      MainComponent,
      SettingsComponent,
      SelectEntitiesComponent,
      InvoicesComponent
   ],
   imports: [
      MaterialModule,
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      getTranslateModule(),
      AlertModule,
   ],
   providers: [
      SettingsService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
