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
exports.getWeatherData = exports.getLatLongFromCityName = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = __importDefault(require("dotenv"));
const icons_1 = require("./icons");
dotenv_1.default.config();
function getDayOfWeekFromUTC(timecode, offset) {
    const utcMilliseconds = timecode * 1000; // Convert seconds to milliseconds
    const offsetMilliseconds = offset * 1000; // Convert hours to milliseconds
    const date = new Date(utcMilliseconds + offsetMilliseconds);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    return dayOfWeek;
}
function getDateFromUTC(timecode, offset) {
    const utcMilliseconds = timecode * 1000; // Convert seconds to milliseconds
    const offsetMilliseconds = offset * 1000; // Convert hours to milliseconds
    const date = new Date(utcMilliseconds + offsetMilliseconds);
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    return `${month} ${day}`;
}
function convertDegreesToDirection(degrees) {
    const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    const index = Math.round(degrees / 45);
    return directions[index];
}
function getLatLongFromCityName(cityName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let api_key = process.env.OPEN_WEATHER_API_KEY;
            let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
            const response = yield (0, node_fetch_1.default)(url);
            const location = yield response.json();
            return { lat: location[0].lat, lon: location[0].lon, name: location[0].name };
        }
        catch (error) {
            throw (error);
        }
    });
}
exports.getLatLongFromCityName = getLatLongFromCityName;
const uvIndexRecommendations = [
    "No protection needed.",
    "No protection needed.",
    "Seek shade during midday hours, wear sunscreen, and cover up.",
    "Seek shade during midday hours, wear sunscreen, and cover up.",
    "Seek shade during midday hours, wear sunscreen, and cover up.",
    "Take precautions - seek shade, wear protective clothing, and use sunscreen.",
    "Take precautions - seek shade, wear protective clothing, and use sunscreen.",
    "Stay in shade near midday, wear protective clothing, and apply SPF 30+ sunscreen.",
    "Stay in shade near midday, wear protective clothing, and apply SPF 30+ sunscreen.",
    "Avoid sun exposure as much as possible.",
    "Avoid sun exposure as much as possible.",
    "Avoid sun exposure as much as possible."
];
function getWeatherData(res, lat, lon) {
    return __awaiter(this, void 0, void 0, function* () {
        let api_key = process.env.OPEN_WEATHER_API_KEY;
        let aggregateData = {
            alert: '',
            current: {
                today: '',
                temp: '',
                rain: '',
                snow: '',
                feels_like: '',
                weather_state: '',
                weather_icon: '',
                weather_description: '',
                wind_speed: '',
                wind_direction: '',
                uv_index: '',
                uv_icon: '',
                uv_description: '',
                humidity: '',
            },
            daily: [],
        };
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
        try {
            const response = yield (0, node_fetch_1.default)(url);
            const weather_data = yield response.json();
            let daily = (weather_data) => {
                let daily_forecasts = [];
                for (let i = 0; i < 8; i++) {
                    daily_forecasts.push({
                        date: getDayOfWeekFromUTC(parseInt(weather_data.daily[i].dt), parseInt(weather_data.timezone_offset)),
                        min: Math.round(weather_data.daily[i].temp.min),
                        max: Math.round(weather_data.daily[i].temp.max),
                        weather_state: weather_data.daily[i].weather[0].main,
                        weather_icon: (0, icons_1.getWeatherIcon)(weather_data.daily[i].weather[0].id),
                        weather_description: weather_data.daily[i].weather[0].description,
                        wind_speed: Math.round(weather_data.daily[i].wind_speed),
                        wind_direction: convertDegreesToDirection(weather_data.daily[i].wind_deg),
                        chance_of_rain: Math.round(weather_data.daily[i].pop * 100),
                        total_rain: weather_data.daily[i].rain ? Math.round(weather_data.daily[i].rain) : 0,
                        total_snow: weather_data.daily[i].snow ? Math.round(weather_data.daily[i].snow) : 0,
                    });
                }
                return daily_forecasts;
            };
            aggregateData = {
                alert: weather_data.alerts ? weather_data.alerts[0].description : '',
                current: {
                    today: getDateFromUTC(parseInt(weather_data.current.dt), parseInt(weather_data.timezone_offset)),
                    temp: Math.round(weather_data.current.temp),
                    feels_like: Math.round(weather_data.current.feels_like),
                    weather_state: weather_data.current.weather[0].main,
                    weather_icon: (0, icons_1.getWeatherIcon)(weather_data.current.weather[0].id),
                    weather_description: weather_data.current.weather[0].description,
                    wind_speed: Math.round(weather_data.current.wind_speed),
                    wind_direction: convertDegreesToDirection(weather_data.current.wind_deg),
                    uv_index: Math.round(weather_data.current.uvi),
                    uv_icon: (0, icons_1.getUVIcon)(Math.round(weather_data.current.uvi)),
                    uv_description: uvIndexRecommendations[Math.round(weather_data.current.uvi)],
                    humidity: weather_data.current.humidity,
                    rain: weather_data.current.rain ? Math.round(weather_data.current.rain['1h']) : 0,
                    snow: weather_data.current.snow ? Math.round(weather_data.current.snow['1h']) : 0,
                },
                daily: daily(weather_data),
            };
            return aggregateData;
        }
        catch (error) {
            throw (error);
        }
    });
}
exports.getWeatherData = getWeatherData;
