import { Component } from "@angular/core";

import * as c3 from "c3";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  stock: number = NaN;
  strike: number = NaN;
  option: number = NaN;

  ngAfterViewInit() {
    let chart = c3.generate({
      bindto: "#chart",
      data: {
        columns: [
          ["data1", 30, 200, 100, 400, 150, 250],
          ["data2", 50, 20, 10, 40, 15, 25]
        ]
      }
    });
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
  }
  get strikePrice(): string {
    return this.getString(this.strike);
  }
  set strikePrice(str: string) {
    this.strike = this.getNumber(str);
  }
  get option100Price(): string {
    return this.getString(this.option100);
  }
  set option100Price(str: string) {
    this.option100 = this.getNumber(str);
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
