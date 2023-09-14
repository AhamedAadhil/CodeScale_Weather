const User = require("../model/user");
const { fetchWeather } = require("../Config/fetchWeather");
const { Mail } = require("../Config/sendMail");
const { createPDF } = require("../Config/createPDF");
const cron = require("node-cron");
const PDFDocument = require("pdfkit");
require("dotenv").config();

//To Update the Weather Location
const updateLocation = async (req, res) => {
  const { location } = req.body; //user will provide this location data through the body
  const { id } = req.user; // get the id of the user by the help of authentication middleware

  try {
    const weatherData = await fetchWeather(location); //get the api response from openweathermap API
    const currentUser = await User.findByIdAndUpdate(
      //update the user's location and weather info in DB
      id,
      { location: location, weather: weatherData },
      { new: true }
    );
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.weatherHistory.push({
      // push the latest weather info into the weatherHistory array of the specific user
      date: new Date(),
      weatherData: weatherData,
    });

    await currentUser.save(); // again save the user

    // Create the PDF and obtain the pdfBuffer
    const pdfBuffer = await createPDF(weatherData);

    // Send the first mail immediately after change the location
    await Mail(currentUser.email, pdfBuffer);

    // Schedule the email to be sent every 3 hours
    cron.schedule("0 */3 * * *", async () => {
      try {
        // Send the latest weather data and the PDF to the user's email address
        await Mail(currentUser.email, pdfBuffer);
      } catch (error) {
        console.error("Error sending weather email:", error);
      }
    });

    // if all done, a success reply will be send as a response
    res.status(200).json({
      message: "Location and Weather updated successfully",
      user: currentUser,
    });
  } catch (error) {
    console.error("Error updating user location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//To get the weather data by Date
const getLocationByDate = async (req, res) => {
  const { date } = req.body; // get the date from user through the body
  const userId = req.user.id;
  try {
    const user = await User.findById(userId); // get the current user from DB

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find weather data by date
    const weatherEntry = user.weatherHistory.find((entry) => {
      // Convert dates to strings to ensure accurate comparison
      return entry.date.toISOString().split("T")[0] === date;
    });

    if (!weatherEntry) {
      return res
        .status(404)
        .json({ message: "Weather data not found for the provided date" });
    }

    res.status(200).json(weatherEntry.weatherData);
  } catch (error) {
    console.error("Error fetching weather data by date:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { updateLocation, getLocationByDate };
