import { ICondition } from "./ICondition";
import { ICurrent } from "./ICurrent";

export interface IHour {
    time_epoch: number,
    time: string,
    temp_c: number,
    temp_f: number,
    is_day: number,
    condition: ICondition,
    current: ICurrent
}