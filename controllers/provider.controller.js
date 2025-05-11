var getProviderSchema = require("../models/provider.model");
var path = require("path");

var providerColRef = getProviderSchema();

async function saveProviderInfo(req, resp) {
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

    // Create a new provider object
    var provider = new providerColRef({
      email: req.body.email,
      firstname: req.body.firstname || "",
      lastname: req.body.lastname || "",
      number: req.body.number || "",
      ppic: req.body.ppic,
      idpic: req.body.idpic,
    });

    // Save the provider to the database
    const savedProvider = await provider.save();

    // Respond with success
    resp.status(201).send({ message: "Provider information saved successfully", provider: savedProvider });
  } catch (err) {
    console.error("Error saving provider information:", err);
    resp.status(500).send({ error: "Failed to save provider information", details: err.message });
  }
}

async function fetchProviderDetails(req, resp) {
  try {
    const { email } = req.query; // Extract email from query parameters

    // Validate input
    if (!email) {
      return resp.status(400).send({ status: false, message: "Email is required" });
    }

    // Find the provider by email
    const provider = await providerColRef.findOne({ email });

    if (!provider) {
      return resp.status(404).send({ status: false, message: "Provider not found" });
    }

    // Respond with provider details
    resp.status(200).send({ status: true, message: "Provider details fetched successfully", user: provider });
  } catch (err) {
    console.error("Error fetching provider details:", err);
    resp.status(500).send({ status: false, message: "Failed to fetch provider details", details: err.message });
  }
}

async function updateProviderInfo(req, resp) {
  try {
    const { email } = req.body; // Extract email from the request body

    // Validate input
    if (!email) {
      return resp.status(400).send({ status: false, message: "Email is required to update provider information" });
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

    // Find the provider by email and update their information
    const updatedProvider = await providerColRef.findOneAndUpdate({ email }, updateData, { new: true });

    if (!updatedProvider) {
      return resp.status(404).send({ status: false, message: "Provider not found" });
    }

    // Respond with success
    resp.status(200).send({ status: true, message: "Provider information updated successfully", provider: updatedProvider });
  } catch (err) {
    console.error("Error updating provider information:", err);
    resp.status(500).send({ status: false, message: "Failed to update provider information", details: err.message });
  }
}

module.exports = { saveProviderInfo, fetchProviderDetails, updateProviderInfo };