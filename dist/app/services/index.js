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
exports.getWeatherData = exports.getDateFromUTC = exports.getDayOfWeekFromUTC = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
function getDayOfWeekFromUTC(timecode, offset) {
    const utcMilliseconds = timecode * 1000; // Convert seconds to milliseconds
    const offsetMilliseconds = offset * 1000; // Convert hours to milliseconds
    const date = new Date(utcMilliseconds + offsetMilliseconds);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    return dayOfWeek;
}
exports.getDayOfWeekFromUTC = getDayOfWeekFromUTC;
function getDateFromUTC(timecode, offset) {
    const utcMilliseconds = timecode * 1000; // Convert seconds to milliseconds
    const offsetMilliseconds = offset * 1000; // Convert hours to milliseconds
    const date = new Date(utcMilliseconds + offsetMilliseconds);
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    return `${month} ${day}`;
}
exports.getDateFromUTC = getDateFromUTC;
function getWeatherData(res, url) {
    return __awaiter(this, void 0, void 0, function* () {
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
        try {
            const response = yield (0, node_fetch_1.default)(url);
            const weather_data = yield response.json();
            let daily = (weather_data) => {
                let daily_forecasts = [];
                for (let i = 1; i < 8; i++) {
                    daily_forecasts.push({
                        date: getDayOfWeekFromUTC(parseInt(weather_data.daily[i].dt), parseInt(weather_data.timezone_offset)),
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
                    today: getDateFromUTC(parseInt(weather_data.current.dt), parseInt(weather_data.timezone_offset)),
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
            return aggregateData;
        }
        catch (error) {
            throw (error);
        }
    });
}
exports.getWeatherData = getWeatherData;
