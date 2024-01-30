import { IAstro } from "./IAstro";
import { ICondition } from "./ICondition";

export interface IForecastDay {
    date: string,
    date_epoch: number,
    day: {
        avgtemp_c: number,
        condition: ICondition
    },
    astro: IAstro
}