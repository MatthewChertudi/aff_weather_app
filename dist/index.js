"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./app/services/index");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const lat = process.env.LAT;
const lon = process.env.LON;
app.get('/', (_req, res, next) => {
    let lat = process.env.LAT;
    let lon = process.env.LON;
    let api_key = process.env.OPEN_WEATHER_API_KEY;
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
    (0, index_1.getWeatherData)(res, url, next);
}, (_req, res) => {
    res.send(res.locals.weather_data);
});
//TODO: app.get with params
//TODO: app.post handler for form submission
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
