import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormGroupUtil } from '@exlibris/exl-cloudapp-angular-lib';
import { SettingsService } from '../models/settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  saving = false;
  
  constructor(
    private settingsService: SettingsService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.settingsService.getSettings()
      .subscribe(settings=>this.form = FormGroupUtil.toFormGroup(settings));
  }

  setAll(value: number) {
    value = Number(value);
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

