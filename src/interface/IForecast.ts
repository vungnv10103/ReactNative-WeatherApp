export interface IForecast {
    date: string,
    day: {
        avgtemp_c: string,
        condition: {
            text: string,
            icon?: string,
            code?: number
        }
    }
}