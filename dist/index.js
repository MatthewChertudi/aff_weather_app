"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./app/services/index");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
const port = process.env.PORT;
const user = {
    firstName: 'Tim',
    lastName: 'Cook',
};
app.get('/', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let lat = process.env.LAT;
    let lon = process.env.LON;
    let api_key = process.env.OPEN_WEATHER_API_KEY;
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
    res.locals.weather_data = yield (0, index_1.getWeatherData)(res, url);
    next();
}), (_req, res) => {
    // console.log(res.locals.weather_data)
    let weather_data = res.locals.weather_data;
    res.render('index', {
        user: user
    });
    // res.send(res.locals.weather_data)
});
//TODO: app.get with params
//TODO: app.post handler for form submission
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
