var getAllParkingSchema = require("../models/allparking.model");
var getParkingSlotSchema = require("../models/parkingslot.model");
var path = require("path");

var allParkingColRef = getAllParkingSchema();

async function saveParkingAndCreateSlots(req, resp) {
  try {
    const { email, name, size, rate, number, country, state, city, location, zip } = req.body;

    // Validate required fields
    if (!email || !name || !size || !rate) {
      return resp.status(400).send({ error: "Email, name, size, and rate are required" });
    }

    // Validate if a parking picture is uploaded
    let ppicPath = null;
    if (req.files && req.files.ppic) {
      ppicPath = path.join(__dirname, "..", "uploads", req.files.ppic.name);
      await req.files.ppic.mv(ppicPath); // Move the uploaded file to the desired location
      ppicPath = req.files.ppic.name; // Save only the file name in the database
    }

    // Dynamically get the model for the admin
    const parkingSlotColRef = getParkingSlotSchema(email); // Use admin email as the admin ID

    // Save parking details in allparking.model.js
    var parking = new allParkingColRef({
      email,
      name,
      size,
      rate,
      number: number || "",
      country: country || "",
      state: state || "",
      city: city || "",
      location: location || "",
      zip: zip || "",
      ppic: ppicPath, // Save the parking picture path
    });

    // Create multiple slots in the dynamically created collection
    const slots = [];
    for (let i = 1; i <= size; i++) {
      slots.push({
        email: "", // Leave empty for free slots
        slotno: i, // Use `i` as a number for slot number
      });
    }

    const savedSlots = await parkingSlotColRef.insertMany(slots);

    const savedParking = await parking.save();

    // Respond with success
    resp.status(201).send({
      message: "Parking details and slots created successfully",
      parking: savedParking,
      slots: savedSlots,
    });
  } catch (err) {
    console.error("Error saving parking details and creating slots:", err);
    resp.status(500).send({ error: "Failed to save parking details and create slots", details: err.message });
  }
}

async function fetchParkingDetails(req, resp) {
  try {
    const { email } = req.query; // Extract email from query parameters

    // Validate input
    if (!email) {
      return resp.status(400).send({ status: false, message: "Email is required" });
    }

    // Find the parking details by email
    const parking = await allParkingColRef.findOne({ email });

    if (!parking) {
      return resp.status(404).send({ status: false, message: "Parking details not found" });
    }

    // Respond with parking details
    resp.status(200).send({ status: true, message: "Parking details fetched successfully", parking });
  } catch (err) {
    console.error("Error fetching parking details:", err);
    resp.status(500).send({ status: false, message: "Failed to fetch parking details", details: err.message });
  }
}

async function updateParkingDetails(req, resp) {
  try {
    const { email } = req.body; // Extract email from the request body

    // Validate input
    if (!email) {
      return resp.status(400).send({ status: false, message: "Email is required to update parking details" });
    }

    // Prepare the update object
    const updateData = {
      name: req.body.name || "",
      size: req.body.size || "",
      rate: req.body.rate || "",
      number: req.body.number || "",
      country: req.body.country || "",
      state: req.body.state || "",
      city: req.body.city || "",
      location: req.body.location || "",
      zip: req.body.zip || "",
    };

    // Check if a new parking picture is uploaded
    if (req.files && req.files.ppic) {
      const ppicPath = path.join(__dirname, "..", "uploads", req.files.ppic.name);
      await req.files.ppic.mv(ppicPath); // Move the uploaded file to the desired location
      updateData.ppic = req.files.ppic.name; // Save only the file name in the database
    }

    // Find the parking by email and update its details
    const updatedParking = await allParkingColRef.findOneAndUpdate({ email }, updateData, { new: true });

    if (!updatedParking) {
      return resp.status(404).send({ status: false, message: "Parking details not found" });
    }

    // Respond with success
    resp.status(200).send({ status: true, message: "Parking details updated successfully", parking: updatedParking });
  } catch (err) {
    console.error("Error updating parking details:", err);
    resp.status(500).send({ status: false, message: "Failed to update parking details", details: err.message });
  }
}

async function fetchAllCities(req, resp) {
  try {
    // Fetch all unique cities from the database
    const cities = await allParkingColRef.distinct("city");

    if (!cities || cities.length === 0) {
      return resp.status(404).send({ status: false, message: "No cities found" });
    }

    // Respond with the list of cities
    resp.status(200).send({ status: true, message: "Cities fetched successfully", cities });
  } catch (err) {
    console.error("Error fetching cities:", err);
    resp.status(500).send({ status: false, message: "Failed to fetch cities", details: err.message });
  }
}

async function fetchParkingFromCity(req, resp) {
  try {
    const { city } = req.query; // Extract city from query parameters

    // Validate input
    if (!city) {
      return resp.status(400).send({ status: false, message: "City is required to fetch parking details" });
    }

    // Fetch parking details for the specified city
    const parkingDetails = await allParkingColRef.find({ city });

    if (!parkingDetails || parkingDetails.length === 0) {
      return resp.status(404).send({ status: false, message: `No parking found in city: ${city}` });
    }

    // Respond with the parking details
    resp.status(200).send({ status: true, message: "Parking details fetched successfully", parkingDetails });
    console.log(parkingDetails);
  } catch (err) {
    console.error("Error fetching parking details:", err);
    resp.status(500).send({ status: false, message: "Failed to fetch parking details", details: err.message });
  }
}

module.exports = { saveParkingAndCreateSlots, fetchParkingDetails, updateParkingDetails, fetchAllCities, fetchParkingFromCity };