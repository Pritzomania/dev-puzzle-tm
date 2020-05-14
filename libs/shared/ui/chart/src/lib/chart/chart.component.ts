import { Component, Input } from '@angular/core';

export type ChartData = [string, number];
export interface Chart {
  title: string;
  type: string;
  data: [];
  columnNames: string[];
  options: object;
}

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {
  @Input() chartData: ChartData[][];

  chart: Chart = {
    title: '',
    type: 'LineChart',
    data: [],
    columnNames: ['period', 'close'],
    options: { title: `Stock price`, width: '600', height: '400' }
  };
}
