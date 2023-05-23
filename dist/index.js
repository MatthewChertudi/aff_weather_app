"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const index_1 = require("./app/services/index");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const lat = process.env.LAT;
const lon = process.env.LON;
app.get('/', (_req, res) => {
    let lat = process.env.LAT;
    let lon = process.env.LON;
    let api_key = process.env.OPEN_WEATHER_API_KEY;
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
    let aggregateData = {
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
    (0, node_fetch_1.default)(url)
        .then(res => res.json())
        .then(weather_data => {
        let daily = (weather_data) => {
            let daily_forecasts = [];
            for (let i = 1; i < 8; i++) {
                daily_forecasts.push({
                    date: (0, index_1.getDayOfWeekFromUTC)(parseInt(weather_data.daily[i].dt), parseInt(weather_data.timezone_offset)),
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
        };
        aggregateData = {
            current: {
                today: (0, index_1.getDateFromUTC)(parseInt(weather_data.current.dt), parseInt(weather_data.timezone_offset)),
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
        res.send(aggregateData);
    });
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
