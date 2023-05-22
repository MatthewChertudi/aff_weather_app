"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const https_1 = __importDefault(require("https"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const lat = process.env.LAT;
const lon = process.env.LON;
app.get('/', (_req, res) => {
    https_1.default.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`, res => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(JSON.parse(data));
        });
    });
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
