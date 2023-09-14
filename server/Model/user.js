const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    weatherData: {
      type: [
        {
          coord: {
            lon: Number,
            lat: Number,
          },
          weather: [
            {
              id: Number,
              main: String,
              description: String,
              icon: String,
            },
          ],
          base: String,
          main: {
            temp: Number,
            feels_like: Number,
            temp_min: Number,
            temp_max: Number,
            pressure: Number,
            humidity: Number,
            sea_level: Number,
            grnd_level: Number,
          },
          visibility: Number,
          wind: {
            speed: Number,
            deg: Number,
            gust: Number,
          },
          clouds: {
            all: Number,
          },
          dt: Number,
          sys: {
            country: String,
            sunrise: Number,
            sunset: Number,
          },
          timezone: Number,
          id: Number,
          name: String,
          cod: Number,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        //a Schema level validation of email pattern
        validator: function (value) {
          return /\S+@\S+\.\S+/.test(value);
        },
        message: "Invalid email format",
      },
      index: true,
    },
    password: {
      type: String,
      require: true,
      minLength: 6,
      Select: true,
    },
    location: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    weatherHistory: [weatherSchema], // Array to store weather data
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
