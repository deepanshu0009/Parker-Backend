var getUserSchema = require("../models/signup-login.model");
var jwt = require("jsonwebtoken"); // Import JWT library
var path = require("path");
var userColRef = getUserSchema();

const SECRET_KEY = "BTI_KOT"; // Replace with a secure secret key

async function signupuser(req, resp) {
  try {
    console.log("User input:", req.body);

    // Validate input
    if (!req.body.email || !req.body.pwd) {
      return resp.status(400).send({ error: "Email and password are required" });
    }

    // Create and save the user
    var obj = new userColRef(req.body);
    const doc = await obj.save();

    // Respond with success
    resp.status(201).send("Signed up successfully");
  } catch (err) {
    console.error("Error during signup:", err.message, err.stack);
    resp.status(500).send({ error: "Signup failed", details: err.message });
  }
}

async function loginuser(req, resp) {
  try {
    const { email, pwd } = req.body;

    // Validate input
    if (!email || !pwd) {
      return resp.status(400).send({ error: "Email and password are required" });
    }

    // Find the user by email
    const user = await userColRef.findOne({ email });

    if (!user) {
      return resp.status(404).send({ error: "User not found" });
    }

    // Check if the password matches
    if (user.pwd !== pwd) {
      return resp.status(401).send({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ email: user.email, id: user.pwd }, SECRET_KEY, { expiresIn: "1h" });

    // Successful login
    resp.status(200).send({ message: "Login successful", token,user });
  } catch (err) {
    console.error("Error during login:", err);
    resp.status(500).send({ error: "Login failed", details: err.message });
  }
}

async function currentuser(req, resp) {
  try {
    const token = req.headers.authorization; // Extract token from the Authorization header

    // Validate token
    if (!token) {
      return resp.status(401).send({ error: "Authorization token is required" });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Find the user by the decoded email
    const user = await userColRef.findOne({ email: decoded.email });

    if (!user) {
      return resp.status(404).send({ error: "User not found" });
    }

    // Return user details
    resp.status(200).send({ message: "User details fetched successfully", user });
  } catch (err) {
    console.error("Error fetching user details:", err);

    // Handle token expiration or invalid token
    if (err.name === "TokenExpiredError") {
      return resp.status(401).send({ error: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return resp.status(401).send({ error: "Invalid token" });
    }

    resp.status(500).send({ error: "Failed to fetch user details", details: err.message });
  }
}

module.exports = { signupuser, loginuser, currentuser };