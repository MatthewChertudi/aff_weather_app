export type DailyData = {
    date: any;
    min: any;
    max: any;
    weather_state: any;
    weather_icon: any;
    weather_description: any;
    wind_speed: any;
    wind_direction: any;
}[];


export type AggregateData = {
    location: string;
    alert: string;
    current: {
        today: any;
        temp: any;
        feels_like: any;
        weather_state: any;
        weather_icon: any;
        weather_description: any;
        wind_speed: any;
        wind_direction: any;
        uv_index: any;
        humidity: any;
        rain: any;
        snow: any;
    };
    daily: DailyData
}