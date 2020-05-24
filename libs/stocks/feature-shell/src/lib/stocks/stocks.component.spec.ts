import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedUiChartModule } from '@coding-challenge/shared/ui/chart';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { StoreModule } from '@ngrx/store';

import { StocksComponent } from './stocks.component';
import { of } from 'rxjs';
import { subDays } from 'date-fns';

const facadeMock = {
  selectedSymbol$: of([]),
  priceQueries$: of([]),
  fetchQuote: jest.fn()
};

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;
  let facade;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StocksComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SharedUiChartModule,
        FormsModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({})
      ],
      providers: [{ provide: PriceQueryFacade, useValue: facadeMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    facade = TestBed.get(PriceQueryFacade);
    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test subscription', fakeAsync(() => {
    const spy = spyOn(facade, 'fetchQuote');
    const today = new Date();
    const someDay = subDays(today, -3);

    component.stockPickerForm.setValue({
      symbol: 'AAPL',
      period: 'max',
      from: someDay,
      to: today
    });
    tick(1000);

    expect(spy).toHaveBeenCalledWith('AAPL', 'max', someDay, today);
  }));
});
