import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { CloudAppSettingsService, CloudAppRestService, FormGroupUtil } from '@exlibris/exl-cloudapp-angular-lib';
import { getSettings } from '../models/settings';
import { ToastrService } from 'ngx-toastr';
import { CanDeactivate } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  saving = false;
  
  constructor(
    private settingsService: CloudAppSettingsService,
    private restService: CloudAppRestService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    getSettings(this.restService, this.settingsService)
      .subscribe(settings=>this.form = FormGroupUtil.toFormGroup(settings));
  }

  setAll(value) {
    for ( let i = 0; i < this.rates.length; i++) {
      this.rates.at(i).patchValue({percent: value});
    }
    this.form.markAsDirty();
  }

  save() {
    this.saving = true;
    this.settingsService.set(this.form.value).subscribe(
      response => {
        this.toastr.success('Settings successfully saved.');
        this.form.markAsPristine();
      },
      err => this.toastr.error(err.message),
      ()  => this.saving = false
    );
  }

  reset() {
    this.load();
  }

  get rates() { 
    return this.form.controls.rates as FormArray;
  }
}

