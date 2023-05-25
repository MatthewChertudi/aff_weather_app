## How to Set Up:

First, enter the cloned folder and install the node dependencies with the command 
```
npm install
```

Next, you need a key for OpenWeatherMap's One Call API 3.0

Here's a step-by-step guide:

1. Visit the OpenWeatherMap website at [https://home.openweathermap.org/subscriptions/unauth_subscribe/onecall_30/base](https://home.openweathermap.org/subscriptions/unauth_subscribe/onecall_30/base).
2. Scroll down to the section titled "Subscribe and get API key."
3. Click on the "Subscribe" button.
4. You will be redirected to the OpenWeatherMap API pricing page.
5. Choose the subscription plan that suits your needs and click on the "Get API Key" button associated with that plan.
6. You will be prompted to create an account if you haven't already. Fill in the required information to register.
7. Once you've created an account and logged in, you will be redirected to the API key generation page.
8. Enter a name for your API key to help identify it.
9. Click on the "Generate" button to create your API key.

After the key is generated, you will see a confirmation message with your API key displayed. 

Create a .env file in the root folder, an example file .env.example is included; add your key to the .env file as OPEN_WEATHER_API_KEY.

### To run the development server
Navigate to the project folder to execute the command 
```
npm run dev
```
The development server runs on [http://localhost:3333/](http://localhost:3333/)

## Credits
1. CSS Reset based upon the work of Josh W Comeau at [https://www.joshwcomeau.com/css/custom-css-reset/](https://www.joshwcomeau.com/css/custom-css-reset/)
2. Free to use animated SVG icons supplied by Bas Milius at [https://github.com/basmilius/weather-icons](https://github.com/basmilius/weather-icons)
