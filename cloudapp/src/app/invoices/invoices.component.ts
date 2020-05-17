import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CloudAppRestService, CloudAppSettingsService, HttpMethod } from '@exlibris/exl-cloudapp-angular-lib';
import { forkJoin, of } from 'rxjs';
import { Settings, getSettings } from '../models/settings';
import { tap, switchMap, catchError, concatMap, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  invoices: any[];
  settings: Settings;
  loading = false;
  displayedColumns = ['number', 'type', 'price', 'current_tax', 'new_tax'];
  results: any;

  constructor(
    private route: ActivatedRoute,
    private restService: CloudAppRestService,
    private settingsService: CloudAppSettingsService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.loading = true;
    getSettings(this.restService, this.settingsService).pipe(
      tap(settings=>this.settings = settings),
      switchMap(() => this.getInvoices())
    )
    .subscribe({
      next: results => this.invoices = results,
      complete: () => this.loading = false
    });
  }

  getInvoices() {
    const ids = this.route.snapshot.params['ids'];
    return forkJoin(ids.split(',').map(id=>this.restService.call(`/acq/invoices/${id}`)))
  }

  calculateTax(line) {
    const rate = this.settings.rates.find(r=>r.code===line.type.value);
    return rate && rate.percent;
  }

  submit() {
    const invoiceUpdates = this.invoices.map(invoice=>this.updateInvoice(invoice));
    this.loading = true;
    forkJoin(invoiceUpdates)
    .subscribe({
      next: (response: any[]) => 
        this.results = response.map(invoice=>
          invoice.isError ? 
            { msg: this.translate.instant('Invoices.InvoiceError',   
              { invoiceNumber: invoice.invoiceNumber, message: invoice.message})} :
            { msg: this.translate.instant('Invoices.InvoiceSuccess', 
              { invoiceNumber: invoice.invoiceNumber, num: invoice.lines.filter(line=>!line.isError).length, total: invoice.lines.length}),
                errors: invoice.lines.filter(line=>line.isError).map(line=>this.translate.instant('Invoices.InvoiceLineError', { lineNumber: line.lineNumber, message: line.message }))}
        ),
      complete: () => this.loading = false
    })
  }

  updateInvoice(invoice) {
    invoice.invoice_vat.vat_per_invoice_line = true;
    let lineUpdates = [];
    if (invoice.invoice_lines) {
      invoice.invoice_lines.invoice_line.forEach(line=>{
        const update = this.updateInvoiceLine(invoice, line);
        if (update) lineUpdates.push(update);
      });
    }
    if (lineUpdates.length==0) {
      return of({invoiceNumber: invoice.number, lines: []})
    }
    return this.restService.call({
      url: invoice.link,
      method: HttpMethod.PUT,
      requestBody: invoice
    }).pipe(
      catchError(err=>of( {
        isError: true, invoiceNumber: invoice.number, message: err.message
      })),
      concatMap(resp=> resp.isError ? of(resp) :
        forkJoin(lineUpdates).pipe(
          map( resp => ({ invoiceNumber: invoice.number, lines: resp }))
        )
      )
    );
  }

  updateInvoiceLine(invoice, line) {
    const percentage = this.calculateTax(line);
    if (percentage && percentage != line.invoice_line_vat.percentage) {
      line.invoice_line_vat = { percentage }
      /* Remove amount from funds (can't have both amount and percentate) */
      if (line.fund_distribution) {
        for (let i=0; i < line.fund_distribution.length; i++) {
          delete line.fund_distribution[i].amount;
        }
      }
      return this.restService.call({
        url: `${invoice.link}/lines/${line.id}`,
        method: HttpMethod.PUT,
        requestBody: line
      }).pipe(
        catchError(err=>of({
          isError: true, lineNumber: line.number, message: err.message
        }))
      )
    }
  }
}
