import { Component, OnInit } from '@angular/core';
import { ChartAPI } from 'c3/index';

import * as c3 from "c3";

class MergeRapidEvent {
  busy = false;
  waiting = null;
  done() {
    this.busy = false;
    if (this.waiting) {
      this.waiting(this.done.bind(this));
      this.waiting = null;
    }
  }
  run(func: Function) {
    const that = this;
    if (!this.busy) {
      this.busy = true;
      func(this.done.bind(this));
    } else {
      this.waiting = func;
    }
  }

}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    this.stockPrice = this.getLocalStorage('stockPrice');
    this.strikePrice = this.getLocalStorage('strikePrice');
    this.optionPrice = this.getLocalStorage('optionPrice');
  }

  stock: number = NaN;
  strike: number = NaN;
  option: number = NaN;

  chart: ChartAPI;

  mergeRapidEvent: MergeRapidEvent = new MergeRapidEvent();

  x1: number[] = [];
  x2: number[] = [];
  y1: number[] = [];
  y2: number[] = [];

  ngAfterViewInit() {
    this.chart = c3.generate({
      bindto: "#chart",
      data: {
        xs: {
          "sell option": 'x1',
          "no option": 'x2',
        },
        columns: [
          ["x1", ...this.x1],
          ["sell option", ...this.y1],
          ["x2", ...this.x2],
          ["no option", ...this.y2]
        ]
      },
      axis: {
        x: {
            label: 'Stock Price'
        },
        y: {
            label: 'Profit'
        }
      }
    });
  }

  update() {
    if (isNaN(this.stock) || isNaN(this.strike) || isNaN(this.option)) {
      return null;
    }
    this.x1 = [0, this.strike, this.strike * 2];
    this.y1 = [this.option - this.stock, this.option + this.strike - this.stock, this.option + this.strike - this.stock];
    this.x2 = [0, this.strike, this.strike * 2];
    this.y2 = [-this.stock, this.strike - this.stock, this.strike * 2 - this.stock];
    if (this.option + this.strike - this.stock > 0 && this.option - this.stock < 0) {
      this.x1.push(this.stock - this.option);
      this.y1.push(0);
      this.x2.push(this.stock - this.option);
      this.y2.push(this.stock - this.option - this.stock);
    }
    if (this.chart) {
      this.mergeRapidEvent.run((done) => {
        this.chart.load({
          unload: true,
          columns: [
            ["x1", ...this.x1],
            ["sell option", ...this.y1],
            ["x2", ...this.x2],
            ["no option", ...this.y2]
          ],
          done: () => done(),
        });
      });
    }
  }

  get stockPrice(): string {
    return this.getString(this.stock);
  }
  set stockPrice(str: string) {
    this.stock = this.getNumber(str);
    this.setLocalStorage('stockPrice', str);
    this.update();
  }
  get strikePrice(): string {
    return this.getString(this.strike);
  }
  set strikePrice(str: string) {
    this.strike = this.getNumber(str);
    this.setLocalStorage('strikePrice', str);
    this.update();
  }
  get optionPrice(): string {
    return this.getString(this.option);
  }
  set optionPrice(str: string) {
    this.option = this.getNumber(str);
    this.setLocalStorage('optionPrice', str);
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
  setLocalStorage(name: string, value: string) {
    window.localStorage.setItem(name, value);
  }
  getLocalStorage(name: string) {
    return window.localStorage.getItem(name);
  }
}
