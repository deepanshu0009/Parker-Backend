var getUserSchema = require("../models/userprofile.model");
var path = require("path");

var userColRef = getUserSchema();

async function saveUserInfo(req, resp) {
  try {
    // Validate if files are uploaded
    if (!req.files || !req.files.ppic || !req.files.idpic) {
      return resp.status(400).send({ error: "Both ppic and idpic files are required" });
    }

    // Define file paths
    var ppicPath = path.join(__dirname, "..", "uploads", req.files.ppic.name);
    var idpicPath = path.join(__dirname, "..", "uploads", req.files.idpic.name);

    // Move the uploaded files to the desired location
    await req.files.ppic.mv(ppicPath);
    await req.files.idpic.mv(idpicPath);

    // Add file paths to the request body
    req.body.ppic = req.files.ppic.name;
    req.body.idpic = req.files.idpic.name;

    // Create a new user object
    var user = new userColRef({
      email: req.body.email,
      firstname: req.body.firstname || "",
      lastname: req.body.lastname || "",
      number: req.body.number || "",
      ppic: req.body.ppic,
      idpic: req.body.idpic,
    });

    // Save the user to the database
    const savedUser = await user.save();

    // Respond with success
    resp.status(201).send({ message: "User information saved successfully", user: savedUser });
  } catch (err) {
    console.error("Error saving user information:", err);
    resp.status(500).send({ error: "Failed to save user information", details: err.message });
  }
}

async function fetchUserDetails(req, resp) {
  try {
    const { email } = req.query; // Extract email from query parameters

    // Validate input
    if (!email) {
      return resp.status(400).send({ status: false, message: "Email is required to fetch user details" });
    }

    // Find the user by email
    const user = await userColRef.findOne({ email });

    if (!user) {
      return resp.status(404).send({ status: false, message: "User not found" });
    }

    // Respond with user details
    resp.status(200).send({ status: true, message: "User details fetched successfully", user });
  } catch (err) {
    console.error("Error fetching user details:", err);
    resp.status(500).send({ status: false, message: "Failed to fetch user details", details: err.message });
  }
}

async function updateUserInfo(req, resp) {
  try {
    const { email } = req.body; // Extract email from the request body

    // Validate input
    if (!email) {
      return resp.status(400).send({ status: false, message: "Email is required to update user information" });
    }

    // Prepare the update object
    const updateData = {
      firstname: req.body.firstname || "",
      lastname: req.body.lastname || "",
      number: req.body.number || "",
    };

    // Check if files are uploaded and update file paths
    if (req.files && req.files.ppic) {
      const ppicPath = path.join(__dirname, "..", "uploads", req.files.ppic.name);
      await req.files.ppic.mv(ppicPath);
      updateData.ppic = req.files.ppic.name;
    }

    if (req.files && req.files.idpic) {
      const idpicPath = path.join(__dirname, "..", "uploads", req.files.idpic.name);
      await req.files.idpic.mv(idpicPath);
      updateData.idpic = req.files.idpic.name;
    }

    // Find the user by email and update their information
    const updatedUser = await userColRef.findOneAndUpdate({ email }, updateData, { new: true });

    if (!updatedUser) {
      return resp.status(404).send({ status: false, message: "User not found" });
    }

    // Respond with success
    resp.status(200).send({ status: true, message: "User information updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user information:", err);
    resp.status(500).send({ status: false, message: "Failed to update user information", details: err.message });
  }
}

module.exports = { saveUserInfo, fetchUserDetails, updateUserInfo };