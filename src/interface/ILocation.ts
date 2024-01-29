export interface ILocation {
    id: number,
    name: string,
    country: string,
    lat: number,
    lon: number,
    localtime?: string,
    localtime_epoch?: string,
    region?: string,
    url?: string,
    tz_id?: string
}