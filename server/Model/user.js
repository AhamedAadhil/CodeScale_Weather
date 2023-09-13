const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        // a custom validation of email in Schema level
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
      Select: true, // determine whether this password field is included while queriying the user (no need if the value is true but I put it)
    },
    location: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
