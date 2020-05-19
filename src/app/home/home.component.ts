import { Component, OnInit } from '@angular/core';

import * as c3 from "c3";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  stock: number = NaN;
  strike: number = NaN;
  option: number = NaN;

  chart: any;

  ngAfterViewInit() {
    this.chart = c3.generate({
      bindto: "#chart",

      data: {
        xs: {
          "stock price": 'x1',
        },
        columns: [
          ["x1", 30, 200, 100, 400, 150, 250],
          ["stock price", 30, 200, 100, 400, 150, 250]
        ]
      }
    });
  }

  update() {
    if (isNaN(this.stock) || isNaN(this.strike) || isNaN(this.option)) {
      return null;
    }
    const x = [];
    const y = [];
  }

  get option100(): number {
    return this.option * 100;
  }
  set option100(num: number) {
    this.option = num / 100.0;
  }

  get stockPrice(): string {
    return this.getString(this.stock);
  }
  set stockPrice(str: string) {
    this.stock = this.getNumber(str);
    this.update();
  }
  get strikePrice(): string {
    return this.getString(this.strike);
  }
  set strikePrice(str: string) {
    this.strike = this.getNumber(str);
    this.update();
  }
  get option100Price(): string {
    return this.getString(this.option100);
  }
  set option100Price(str: string) {
    this.option100 = this.getNumber(str);
    this.update();
  }

  getString(num: number): string {
    if (num !== undefined && !isNaN(num)) {
      return "" + num;
    } else {
      return "";
    }
  }
  getNumber(str: string): number {
    if (str === "") {
      return NaN;
    } else {
      return +str;
    }
  }
}
