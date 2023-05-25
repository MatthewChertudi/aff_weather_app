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
const port = process.env.PORT;
app.use(express_1.default.static('public'));
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get('/', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.location = process.env.LOCATION;
    res.locals.weather_data = yield (0, index_1.getWeatherData)(res, process.env.LAT, process.env.LON);
    next();
}), (_req, res) => {
    let weather_data = res.locals.weather_data;
    res.render('index');
});
//TODO: app.post handler for form submission
app.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let location = req.body.cityName = req.body.city.trim();
    try {
        let { lat, lon, name } = yield (0, index_1.getLatLongFromCityName)(location);
        res.locals.location = name;
        res.locals.weather_data = yield (0, index_1.getWeatherData)(res, lat, lon);
        next();
    }
    catch (error) {
        res.redirect('/');
    }
}), (_req, res) => {
    let weather_data = res.locals.weather_data;
    res.render('index');
});
//TODO: app.get with params
app.get('/:location', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let location = _req.params.location;
    try {
        let { lat, lon, name } = yield (0, index_1.getLatLongFromCityName)(location);
        res.locals.location = name;
        res.locals.weather_data = yield (0, index_1.getWeatherData)(res, lat, lon);
        next();
    }
    catch (error) {
        res.redirect('/');
    }
}), (_req, res) => {
    let weather_data = res.locals.weather_data;
    res.render('index');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
