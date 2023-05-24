import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getWeatherData, getLatLongFromCityName } from './app/services/index';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.static('public'))
app.set('view engine', 'ejs');



app.get('/', async (_req: Request, res: Response, next) => {
    res.locals.location = process.env.LOCATION;
    res.locals.weather_data = await getWeatherData(res, process.env.LAT!, process.env.LON!);
    next()
    },
    (_req: Request, res: Response) => {
        let weather_data = res.locals.weather_data
        res.render('index')
    });

//TODO: app.get with params

//TODO: app.post handler for form submission
app.get('/boise', async (_req: Request, res: Response, next) => {
    let { lat, lon, name } = await getLatLongFromCityName('Portland');
    res.locals.location = name;
    res.locals.weather_data = await getWeatherData(res, lat, lon);
    next()
},
    (_req: Request, res: Response) => {
        let weather_data = res.locals.weather_data
        res.render('index')
    });

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
