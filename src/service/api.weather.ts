import axios from 'axios';
import { apiKeyWeather } from '../constants';

const forecastEndpoint = (params: { cityName: string; days: number; }) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWeather}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationsEmdpoint = (params: { cityName: string; }) => `https://api.weatherapi.com/v1/search.json?key=${apiKeyWeather}&q=${params.cityName}`;

const apiCall = async (endpoint: string) => {
    const options = {
        method: "GET",
        url: endpoint
    }

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.log(`weather: apiCall:`, error);
        return;
    }
}

export const fetchWeatherForecast = (params: { cityName: string; days: number; }) => {
    return apiCall(forecastEndpoint(params));
}

export const fetchLocation = (params: { cityName: string; }) => {
    return apiCall(locationsEmdpoint(params));
}
