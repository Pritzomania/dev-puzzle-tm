import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { subDays } from 'date-fns';

export enum TimePeriodViewValue {
  ALL = 'All available data',
  FIVE_YEARS = 'Five years',
  TWO_YEARS = 'Two years',
  ONE_YEAR = 'One year',
  YEAR_TO_DATE = 'Year-to-date',
  SIX_MONTHS = 'Six months',
  THREE_MONTHS = 'Three months',
  ONE_MONTH = 'One month',
  CUSTOM = 'Custom'
}

export enum TimePeriodValue {
  ALL = 'max',
  FIVE_YEARS = '5y',
  TWO_YEARS = '2y',
  ONE_YEAR = '1y',
  YEAR_TO_DATE = 'ytd',
  SIX_MONTHS = '6m',
  THREE_MONTHS = '3m',
  ONE_MONTH = '1m',
  CUSTOM = 'custom'
}

export interface TimePeriod {
  viewValue: TimePeriodViewValue;
  value: TimePeriodValue;
}

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

  timePeriods: TimePeriod[] = [
    { viewValue: TimePeriodViewValue.ALL, value: TimePeriodValue.ALL },
    {
      viewValue: TimePeriodViewValue.FIVE_YEARS,
      value: TimePeriodValue.FIVE_YEARS
    },
    {
      viewValue: TimePeriodViewValue.TWO_YEARS,
      value: TimePeriodValue.TWO_YEARS
    },
    {
      viewValue: TimePeriodViewValue.ONE_YEAR,
      value: TimePeriodValue.ONE_YEAR
    },
    {
      viewValue: TimePeriodViewValue.YEAR_TO_DATE,
      value: TimePeriodValue.YEAR_TO_DATE
    },
    {
      viewValue: TimePeriodViewValue.SIX_MONTHS,
      value: TimePeriodValue.SIX_MONTHS
    },
    {
      viewValue: TimePeriodViewValue.THREE_MONTHS,
      value: TimePeriodValue.THREE_MONTHS
    },
    {
      viewValue: TimePeriodViewValue.ONE_MONTH,
      value: TimePeriodValue.ONE_MONTH
    },

    { viewValue: TimePeriodViewValue.CUSTOM, value: TimePeriodValue.CUSTOM }
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
