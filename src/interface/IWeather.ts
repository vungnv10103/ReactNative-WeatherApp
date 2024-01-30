import { ICurrent } from "./ICurrent";
import { IForecastDay } from "./IForecastDay";
import { ILocation } from "./ILocation";

export interface IWeather {
    location: ILocation,
    current: ICurrent,
    forecast: {
        forecastday: IForecastDay[],
    },
}