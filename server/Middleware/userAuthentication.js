const jwt = require("jsonwebtoken");

//a middleware to check if the user is legit and has a token to experience the features of this application
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // get the token from header if exist
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" }); // of token not exist it will throw Unauthorized message
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET); //verify the token
    const { email, id } = decodeToken; // fetch user's info from the token
    req.user = { email, id }; //assign the fetched values to the user variable

    // Calculate the remaining time before token expiration
    const tokenExpirationTime = new Date(decodeToken.exp * 1000).getTime();
    const currentTime = new Date().getTime();
    const remainingTime = tokenExpirationTime - currentTime;

    // If the remaining time is less than 1 minute (60000 milliseconds), return a custom response
    if (remainingTime < 60000) {
      return res.status(401).json({ message: "Token about to expire" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = isAuthenticated;
