const mongoose = require("mongoose");

const locationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    long: {
      type: String,
      require: true,
    },
    lat: {
      type: String,
      require: true,
    },
    data: {
      type: Object,
      require: true,
    },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
