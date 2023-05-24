import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getWeatherData } from './app/services/index';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');



app.get('/', async (_req: Request, res: Response, next) => {
    let lat = process.env.LAT;
    let lon = process.env.LON;
    let api_key = process.env.OPEN_WEATHER_API_KEY;
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;

    res.locals.weather_data = await getWeatherData(res, url);
    next()
},
    (_req: Request, res: Response) => {
        // console.log(res.locals.weather_data)
        let weather_data = res.locals.weather_data
        res.render('index')
    });

//TODO: app.get with params

//TODO: app.post handler for form submission

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
