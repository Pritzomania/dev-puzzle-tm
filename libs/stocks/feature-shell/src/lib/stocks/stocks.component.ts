import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { subDays } from 'date-fns';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
  stockPickerForm: FormGroup;
  quotes$ = this.priceQuery.priceQueries$;
  formSub$: Subscription;
  today: Date = new Date();

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' },
    { viewValue: 'Custom', value: 'custom' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    const lastWeek = subDays(this.today, 7);
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required],
      from: [lastWeek, Validators.required],
      to: [this.today, Validators.required]
    });
  }

  ngOnInit() {
    this.formSub$ = this.stockPickerForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => this.fetchQuote());
  }

  ngOnDestroy(): void {
    this.formSub$.unsubscribe();
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, period, from, to } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, period, from, to);
    }
  }

  fromDateFilter = (date: Date): boolean => {
    const { to } = this.stockPickerForm.value;
    if (!to) return true;
    return to.getTime() >= date.getTime();
  };

  toDateFilter = (date: Date): boolean => {
    const { from } = this.stockPickerForm.value;
    if (!from) return true;
    return from.getTime() <= date.getTime();
  };
}
