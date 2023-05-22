import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';


dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const lat = process.env.LAT;
const lon = process.env.LON;

app.get('/', (_req: Request, res: Response) => {

    let lat = process.env.LAT;
    let lon = process.env.LON;
    let api_key = process.env.OPEN_WEATHER_API_KEY;
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
    let aggregateData = {};

    fetch(url, aggregateData)
        .then(res => res.json())
        .then(weather_data => {
            aggregateData = {
                current: {
                    today: weather_data.current.dt, //UTC Timestamp
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
            };
            res.send(aggregateData);
        })
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});