const axios = require("axios");
require("dotenv").config();

//fetch the weather info based on the latest location of the user
const fetchWeather = async (location) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.API_KEY}&units=metric`
    );
    const weatherData = response.data;
    return weatherData;
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
};

module.exports = { fetchWeather };
