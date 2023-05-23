export type DailyData = {
    date: any;
    temp: any;
    weather_state: any;
    weather_icon: any;
    weather_description: any;
    wind_speed: any;
    wind_direction: any;
}[];


export type AggregateData = {
    current: {
        today: any;
        temp: any;
        feels_like: any;
        weather_state: any;
        weather_icon: any;
        weather_description: any;
        wind_speed: any;
        wind_direction: any;
    };
    daily: DailyData
}