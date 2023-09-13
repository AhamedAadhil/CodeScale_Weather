const User = require("../model/user");
const Weather = require("../Model/weather");
const { fetchWeather } = require("../Config/fetchWeather");
require("dotenv").config();

const updateLocation = async (req, res) => {
  const { location } = req.body;
  const { id } = req.user;

  try {
    const currentUser = await User.findByIdAndUpdate(
      id,
      { location: location },
      { new: true }
    );
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const weatherData = fetchWeather(location);

    const newWeatherData = new Weather({
      userId: currentUser._id,
      date: new Date(),
      ...weatherData, // Spread the retrieved weather data into the document
    });

    // Save the new WeatherData document to the database
    await newWeatherData.save();

    res
      .status(200)
      .json({ message: "Location updated successfully", user: currentUser });
  } catch (error) {
    console.error("Error updating user location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { updateLocation };
