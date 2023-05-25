// A realy simple (but tedious to create) service to get the icon name from the weather code
export function getWeatherIcon(weatherCode: number): string {
    let icon = '';
    switch (weatherCode) {
        // Group 200: Thunderstorm
        case 200:
        case 201:
        case 202:
        case 230:
        case 231:
        case 232:
            icon = 'thunderstorms-rain';
            break;
        case 210:
        case 211:
        case 212:
        case 221:
            icon = 'thunderstorms';
            break;
        // Group 300: Drizzle
        case 300:
        case 301:
        case 302:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 321:
            icon = 'drizzle';
            break;
        // Group 500: Rain
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 520:
        case 521:
        case 522:
        case 531:
            icon = 'rain';
            break;
        // Group Subset 500 & 600: Sleet
        case 511:
        case 611:
        case 612:
        case 613:
        case 615:
        case 616:
            icon = 'sleet';
            break;
        // Group 600: Snow
        case 600:
        case 601:
        case 602:
        case 620:
        case 621:
        case 622:
            icon = 'snow';
            break;
        // Group 700: Atmospheric Conditions
        case 701:
            icon = 'mist';
            break;
        case 711:
        case 762:
            icon = 'smoke';
            break;
        case 721:
            icon = 'haze';
            break;
        case 731:
        case 751:
        case 761:
            icon = 'dust';
            break;
        case 741:
            icon = 'fog';
            break;
        case 771:
            icon = 'wind';
            break;
        case 781:
            icon = 'tornado';
            break;
        // Group 800: Clear & Clouds
        case 800:
            icon = 'clear-day';
            break;
        case 801:
        case 802:
            icon = 'partly-cloudy-day';
            break;
        case 803:
            icon = 'cloudy';
            break;
        case 804:
            icon = 'overcast';
            break;
        default:
            icon = `not-available for ${weatherCode}`;
    }
    return icon
}

export function getUVIcon(uvi: number): string {
    let icon = '';
    if (Math.round(uvi) === 0){
        icon = 'clear-night'
    } else {
        icon = `uv-index-${Math.round(uvi)}`
    }
    return icon
}