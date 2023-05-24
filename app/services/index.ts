import { Response } from 'express';
import fetch from 'node-fetch';
import { AggregateData } from '../types/types';
import dotenv from 'dotenv';

dotenv.config();

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

function convertDegreesToDirection(degrees: number): string {
  const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
  const index = Math.round(degrees / 45);
  return directions[index];
}

export async function getLatLongFromCityName(cityName: string): Promise<{ lat: string; lon: string, name: string }> {
  try {
    let api_key = process.env.OPEN_WEATHER_API_KEY;
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    const response = await fetch(url);
    const location = await response.json();
    console.log(location);
    
    return { lat: location[0].lat, lon: location[0].lon, name: location[0].name };
  } catch (error) {
    throw (error);
  }
}

export async function getWeatherData(res: Response, lat: string, lon: string): Promise<AggregateData> {
  let api_key = process.env.OPEN_WEATHER_API_KEY;
  let aggregateData: AggregateData = {
    alert: '',
    current: {
      today: '',
      temp: '',
      rain: '',
      snow: '',
      feels_like: '',
      weather_state: '',
      weather_icon: '',
      weather_description: '',
      wind_speed: '',
      wind_direction: '',
      uv_index: '',
      humidity: '',
    },
    daily: [],
  };

  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;

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
          wind_direction: convertDegreesToDirection(weather_data.daily[i].wind_deg),
          chance_of_rain: Math.round(weather_data.daily[i].pop * 100),
          total_rain: weather_data.daily[i].rain ? Math.round(weather_data.daily[i].rain) : 0,
          total_snow: weather_data.daily[i].snow ? Math.round(weather_data.daily[i].snow) : 0,
        });
      }
      return daily_forecasts;
    };
    aggregateData = {
      alert: weather_data.alerts ? weather_data.alerts[0].description : '',
      current: {
        today: getDateFromUTC(parseInt(weather_data.current.dt), parseInt(weather_data.timezone_offset)), //UTC Timestamp
        temp: Math.round(weather_data.current.temp),
        feels_like: Math.round(weather_data.current.feels_like),
        weather_state: weather_data.current.weather[0].main,
        weather_icon: weather_data.current.weather[0].icon,
        weather_description: weather_data.current.weather[0].description,
        wind_speed: Math.round(weather_data.current.wind_speed),
        wind_direction: convertDegreesToDirection(weather_data.current.wind_deg),
        uv_index: weather_data.current.uvi,
        humidity: weather_data.current.humidity,
        rain: weather_data.current.rain ? Math.round(weather_data.current.rain['1h']) : 0,
        snow: weather_data.current.snow ? Math.round(weather_data.current.snow['1h']) : 0,
      },
      daily: daily(weather_data),
    };

    return aggregateData;
  } catch (error) {
    throw (error);
  }
}