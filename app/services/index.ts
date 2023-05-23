import { NextFunction, Response } from 'express';
import fetch from 'node-fetch';
import { AggregateData } from '../types/types';

export function getDayOfWeekFromUTC(timecode: number, offset: number): string {
    const utcMilliseconds = timecode * 1000; // Convert seconds to milliseconds
    const offsetMilliseconds = offset * 1000; // Convert hours to milliseconds
    const date = new Date(utcMilliseconds + offsetMilliseconds);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[date.getUTCDay()];
  
    return dayOfWeek;
  }

  export function getDateFromUTC(timecode: number, offset: number): string {
    const utcMilliseconds = timecode * 1000; // Convert seconds to milliseconds
    const offsetMilliseconds = offset * 1000; // Convert hours to milliseconds
  
    const date = new Date(utcMilliseconds + offsetMilliseconds);
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();

    return `${month} ${day}`;
  }

  export function getWeatherData(res: Response, url: string, next: NextFunction): void {
    let aggregateData: AggregateData = {
        current: {
            today: '',
            temp: '',
            feels_like: '',
            weather_state: '',
            weather_icon: '',
            weather_description: '',
            wind_speed: '',
            wind_direction: '',
        },
        daily: [],
    };

    fetch(url)
        .then(res => res.json())
        .then(weather_data => {
            let daily = (weather_data: {
                timezone_offset: string; 
                daily: {
                    dt: any;
                    temp: any;
                    weather: any;
                    wind_speed: any;
                    wind_deg: any;
                }[]; }) => {
                let daily_forecasts = [];
                for (let i = 1; i < 8; i++) {
                    daily_forecasts.push({
                        date: getDayOfWeekFromUTC(parseInt(weather_data.daily[i].dt), parseInt(weather_data.timezone_offset)),
                        min: Math.round(weather_data.daily[i].temp.min),
                        max: Math.round(weather_data.daily[i].temp.max),
                        weather_state: weather_data.daily[i].weather[0].main,
                        weather_icon: weather_data.daily[i].weather[0].icon,
                        weather_description: weather_data.daily[i].weather[0].description,
                        wind_speed: Math.round(weather_data.daily[i].wind_speed),
                        wind_direction: weather_data.daily[i].wind_deg,
                    });
                }
                return daily_forecasts;
            } 
            aggregateData = {
                current: {
                    today: getDateFromUTC(parseInt(weather_data.current.dt), parseInt(weather_data.timezone_offset)), //UTC Timestamp
                    temp: Math.round(weather_data.current.temp),
                    feels_like: 
                        //Check if the "Feels Like" temp is signficantly different from actual temp, otherwise return an empty string (falsy).
                        Math.abs(weather_data.current.temp - weather_data.current.feels_like) > 5 
                            ? weather_data.current.feels_like
                            : '',
                    weather_state: weather_data.current.weather[0].main,
                    weather_icon: weather_data.current.weather[0].icon,
                    weather_description: weather_data.current.weather[0].description,
                    wind_speed: Math.round(weather_data.current.wind_speed),
                    wind_direction: weather_data.current.wind_deg,
                },
                daily: daily(weather_data),
            };
            
            res.locals.weather_data = aggregateData;
            next();
        })
}