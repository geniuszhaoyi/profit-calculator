
export interface Range {
    lower: number;
    upper: number;
}

export abstract class Calculator {

    initPrice: number;
    strike: number;
    initOption: number;

    public constructor(price: number, strike: number, option: number) {
        this.update(price, strike, option);
    }

    public update(price: number, strike: number, option: number) {
        this.initPrice = price;
        this.strike = strike;
        this.initOption = option;
    }

    abstract profit(price: number): number;

    specialXs(): number[] {
        return [];
    }

    range(): Range {
        return {
            lower: 0,
            upper: this.strike * 2
        }
    }

}

export class BuyingStock extends Calculator {

    profit(price: number): number {
        return price - this.initPrice;
    }

}

export class Idling extends Calculator {

    profit(price: number): number {
        return 0;
    }

}

export class BuyingOption extends Calculator {
    
    profit(price: number): number {
        if (price < this.strike) {
            return -this.initOption;
        } else {
            return price - this.strike - this.initOption;
        }
    }

    specialXs(): number[] {
        return [this.strike];
    }

}

export class BuyingStockSellingOption extends Calculator {
    
    profit(price: number): number {
        if (price < this.strike) {
            return price + this.initOption - this.initPrice;
        } else {
            return this.initOption + this.strike - this.initPrice;
        }
    }

    specialXs(): number[] {
        return [this.strike];
    }

}

const defaultCandidateSteps = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 4, 5, 10, 20, 25, 50, 100];

export function getXs(cs: Calculator[], numStep = 75, candidateSteps = defaultCandidateSteps): number[] {
    if (cs.length > 0) {
        let { lower, upper }: Range = cs[0].range();
        let specialXs = [];
        cs.forEach((c: Calculator) => {
            if (lower > c.range().lower) {
                lower = c.range().lower;
            }
            if (upper > c.range().upper) {
                upper = c.range().upper;
            }
            specialXs = [...specialXs, ...c.specialXs()];
        });

        let step = (upper - lower) / numStep;
        step = findSmallestWhileLargerThan(step, candidateSteps);

        const res = [];
        for (let i = Math.ceil(lower / step) * step; i < upper; i += step) {
            res.push(i);
        }

        return [lower, ...res, upper, ...specialXs];
    } else {
        return [];
    }
}

function findSmallestWhileLargerThan(x: number, inArray: number[]): number {
    for (let c of inArray) {
        if (c > x) {
            return c;
        }
    }
    return inArray[inArray.length - 1];
}

export function getYs(c: Calculator, xs: number[]): number[] {
    return xs.map(x => c.profit(x));
}