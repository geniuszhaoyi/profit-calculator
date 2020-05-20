import { Component, OnInit } from '@angular/core';
import { ChartAPI, Primitive } from 'c3/index';

import { BuyingStock, BuyingOption, getXs, getYs, Calculator, Idling } from '../ts/Calculator';

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

class Line {
  model: Calculator;
  label: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    this.mergeRapidEvent.busy = true;
    this.stockPrice = this.getLocalStorage('stockPrice');
    this.strikePrice = this.getLocalStorage('strikePrice');
    this.optionPrice = this.getLocalStorage('optionPrice');
  }

  stock: number = NaN;
  strike: number = NaN;
  option: number = NaN;

  chart: ChartAPI;

  mergeRapidEvent: MergeRapidEvent = new MergeRapidEvent();

  buyingStock = new BuyingStock(this.stock, 0, 0);
  buyingOption = new BuyingOption(this.stock, this.strike, this.option);
  idling = new Idling(0, 0, 0);

  chartData: Line[] = [
    {
      label: "0",
      model: this.idling,
    },
    {
      label: "buy stock",
      model: this.buyingStock,
    },
    {
      label: "sell covered option",
      model: this.buyingOption,
    },
  ]

  ngAfterViewInit() {
    const xs = {};
    const columns: [string, ...Primitive[]][] = [['x']];
    this.chartData.forEach(l => {
      xs[l.label] = 'x';
      columns.push([l.label]);
    });

    this.chart = c3.generate({
      bindto: "#chart",
      data: {
        xs: xs,
        columns: columns,
      },
      axis: {
        x: {
            label: 'Stock Price'
        },
        y: {
            label: 'Profit'
        }
      },
      point: {
        show: false
      },
      zoom: {
        enabled: true
      },
      size: {
        height: 480
      },
      onrendered: () => {
        setTimeout(() => {
          this.mergeRapidEvent.done();
        });
      },
    });
  }

  update() {
    if (isNaN(this.stock) || isNaN(this.strike) || isNaN(this.option)) {
      return null;
    }

    this.chartData.forEach(cd => cd.model.update(this.stock, this.strike, this.option));

    this.mergeRapidEvent.run((done) => {
      const xs = getXs(this.chartData.map(l => l.model));

      const columns: [string, ...Primitive[]][] = [['x', ...xs]];
      this.chartData.forEach(l => {
        columns.push([l.label, ...getYs(l.model, xs).map(v => Math.round(v * 100) / 100.0)]);
      });

      this.chart.load({
        unload: true,
        columns: columns,
        done: () => done(),
      });
    });
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
