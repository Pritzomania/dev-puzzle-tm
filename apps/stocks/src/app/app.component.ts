import { Component } from '@angular/core';

@Component({
  selector: 'coding-challenge-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string;
  public constructor() {
    this.title = 'stocks';
  }
}
