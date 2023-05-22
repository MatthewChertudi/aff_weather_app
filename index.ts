import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import httpsModule from 'https';


dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const lat = process.env.LAT;
const lon = process.env.LON;

app.get('/', (_req: Request, res: Response) => {
    httpsModule.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`, res => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(JSON.parse(data));
        });
    })
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});