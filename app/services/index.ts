import { Response } from 'express';
import fetch from 'node-fetch';
import { AggregateData } from '../types/types';

function getLocation(locationPair: string): string {
  const [country, city] = locationPair.split('/');
  return city.trim();
}

function getDayOfWeekFromUTC(timecode: number, offset: number): string {
  const utcMilliseconds = timecode * 1000; // Convert seconds to milliseconds
  const offsetMilliseconds = offset * 1000; // Convert hours to milliseconds
  const date = new Date(utcMilliseconds + offsetMilliseconds);
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeek = daysOfWeek[date.getUTCDay()];

  return dayOfWeek;
}

function getDateFromUTC(timecode: number, offset: number): string {
  const utcMilliseconds = timecode * 1000; // Convert seconds to milliseconds
  const offsetMilliseconds = offset * 1000; // Convert hours to milliseconds

  const date = new Date(utcMilliseconds + offsetMilliseconds);
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();

  return `${month} ${day}`;
}

export async function getWeatherData(res: Response, url: string): Promise<AggregateData> {
  let aggregateData: AggregateData = {
    location: '',
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

  try {
    const response = await fetch(url);
    const weather_data = await response.json();

    let daily = (weather_data: {
      timezone_offset: string;
      daily: {
        rain: number;
        snow: number;
        pop: number;
        dt: any;
        temp: any;
        weather: any;
        wind_speed: any;
        wind_deg: any;
      }[];
    }) => {
      let daily_forecasts = [];
      for (let i = 0; i < 8; i++) {
        daily_forecasts.push({
          date: getDayOfWeekFromUTC(parseInt(weather_data.daily[i].dt), parseInt(weather_data.timezone_offset)),
          min: Math.round(weather_data.daily[i].temp.min),
          max: Math.round(weather_data.daily[i].temp.max),
          weather_state: weather_data.daily[i].weather[0].main,
          weather_icon: weather_data.daily[i].weather[0].icon,
          weather_description: weather_data.daily[i].weather[0].description,
          wind_speed: Math.round(weather_data.daily[i].wind_speed),
          wind_direction: weather_data.daily[i].wind_deg,
          chance_of_rain: Math.round(weather_data.daily[i].pop * 100),
          total_rain: weather_data.daily[i].rain ? Math.round(weather_data.daily[i].rain) : 0,
          total_snow: weather_data.daily[i].snow ? Math.round(weather_data.daily[i].snow) : 0,
        });
      }
      return daily_forecasts;
    };
    aggregateData = {
      location: getLocation(weather_data.timezone),
      current: {
        today: getDateFromUTC(parseInt(weather_data.current.dt), parseInt(weather_data.timezone_offset)), //UTC Timestamp
        temp: Math.round(weather_data.current.temp),
        feels_like: weather_data.current.feels_like,
        weather_state: weather_data.current.weather[0].main,
        weather_icon: weather_data.current.weather[0].icon,
        weather_description: weather_data.current.weather[0].description,
        wind_speed: Math.round(weather_data.current.wind_speed),
        wind_direction: weather_data.current.wind_deg,
      },
      daily: daily(weather_data),
    };

    return aggregateData;
  } catch (error) {
    throw (error);
  }
}