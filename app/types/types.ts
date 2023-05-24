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