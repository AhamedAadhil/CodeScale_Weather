const User = require("../model/user");
const { fetchWeather } = require("../Config/fetchWeather");
const { Mail } = require("../Config/sendMail");
const { createPDF } = require("../Config/createPDF");
const cron = require("node-cron");
const PDFDocument = require("pdfkit");
require("dotenv").config();

const updateLocation = async (req, res) => {
  const { location } = req.body;
  const { id } = req.user;

  try {
    const weatherData = await fetchWeather(location);
    const currentUser = await User.findByIdAndUpdate(
      id,
      { location: location, weather: weatherData },
      { new: true }
    );
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.weatherHistory.push({
      date: new Date(),
      weatherData: weatherData,
    });

    await currentUser.save();

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

    res.status(200).json({
      message: "Location and Weather updated successfully",
      user: currentUser,
    });
  } catch (error) {
    console.error("Error updating user location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLocationByDate = async (req, res) => {
  const { date } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find weather data by date
    const weatherEntry = user.weatherHistory.find((entry) => {
      // Convert both dates to strings to ensure accurate comparison
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
