const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body; // get username, password from the user through the body
  const currentUser = await User.findOne({ email }); // find the user from DB if exist

  if (!currentUser) {
    // if not exist, it will throw this message
    res.status(400).json({ message: "User Not Found!" });
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, currentUser.password); // compare the user's entered password against the legit password in DB

  if (!isPasswordValid) {
    res.status(400).json({ message: "Incorrect Credentials!" }); // if password incorrect, throw this message
    return;
  }

  //generate token with user's info such as email, id and make the token auto expire in 1h
  const token = jwt.sign(
    {
      email: currentUser.email,
      id: currentUser._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.setHeader("Authorization", `Bearer ${token}`); //send the token in header as Authorization
  res.status(200).json({ token: token }); // if all done, send the token as response in successfull login attempt
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

    const salt = await bcrypt.genSalt(10); //generate a salt to hash the password
    const hashedPass = await bcrypt.hash(password, salt); // hash the user's password

    //create a new user object with the given data
    const newUser = new User({
      email,
      password: hashedPass,
    });

    const saveUser = await newUser.save(); //save this new user info into the DB
    res.status(200).json({ user: saveUser }); // if all go right, the new user info will be show as response
  } catch (err) {
    //error handling
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    } else {
      console.error(err);
      return res.status(500).json({ message: "Internal server Error" });
    }
  }
};

module.exports = { login, register };
