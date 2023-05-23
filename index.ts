import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { AggregateData } from './app/types/types';
import { getDayOfWeekFromUTC, getDateFromUTC, getWeatherData } from './app/services/index';
import { NextFunction } from 'express-serve-static-core';


dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const lat = process.env.LAT;
const lon = process.env.LON;



app.get('/', (_req: Request, res: Response, next) => {
    let lat = process.env.LAT;
    let lon = process.env.LON;
    let api_key = process.env.OPEN_WEATHER_API_KEY;
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
    
    getWeatherData(res, url, next);
   
}, 
(_req: Request, res: Response) => {
    res.send(res.locals.weather_data)
});

//TODO: app.get with params

//TODO: app.post handler for form submission

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
