const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./Config/db");
require("dotenv").config();

//Seperate Routes for auth and location,weather
const authRoutes = require("./Routes/auth");
const locationRoutes = require("./Routes/location");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/location", locationRoutes);

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`App is Running on ${port}`);
});
