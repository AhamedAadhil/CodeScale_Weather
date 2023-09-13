const axios = require("axios");
require("dotenv").config();

const fetchWeather = async (location) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.API_KEY}&units=metric`
    );
    const weatherData = response.data;
    console.log(weatherData);
    return weatherData;
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
};

module.exports = { fetchWeather };