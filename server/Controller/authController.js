const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;
  const currentUser = await User.findOne({ email });

  if (!currentUser) {
    res.status(400).json({ message: "User Not Found!" });
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, currentUser.password);

  if (!isPasswordValid) {
    res.status(400).json({ message: "Incorrect Credentials!" });
    return;
  }

  const token = jwt.sign(
    {
      email: currentUser.email,
      username: currentUser.name,
      id: currentUser._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.setHeader("Authorization", `Bearer ${token}`);
  res.status(200).json({ token: token, session: session });
};

// New User Registration Controller
const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      res.status(400).json({ message: "Email Already Taken!" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPass,
    });

    const saveUser = await newUser.save();
    res.status(200).json({ user: saveUser });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    } else {
      console.error(err);
      return res.status(500).json({ message: "Internal server Error" });
    }
  }
};

module.exports = { login, register };
