const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./Config/db");
require("dotenv").config();

const authRoutes = require("./Routes/auth");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`App is Running on ${port}`);
});
