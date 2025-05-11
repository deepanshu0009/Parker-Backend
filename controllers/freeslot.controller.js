var getAllParkingSchema = require("../models/allparking.model");

var allParkingColRef = getAllParkingSchema();

async function fetchRate(req, resp) {
  try {
    const { email } = req.query; // Extract email from query parameters

    // Validate input
    if (!email) {
      return resp.status(400).send({ status: false, message: "Email is required to fetch the parking rate" });
    }

    // Find the parking by email
    const parking = await allParkingColRef.findOne({ email });

    if (!parking) {
      return resp.status(404).send({ status: false, message: "Parking not found for the given email" });
    }

    // Respond with the rate of the parking
    resp.status(200).send({
      status: true,
      message: "Parking rate fetched successfully",
      rate: parking.rate, // Assuming the `rate` field exists in the schema
    });
  } catch (err) {
    console.error("Error fetching parking rate:", err);
    resp.status(500).send({ status: false, message: "Failed to fetch parking rate", details: err.message });
  }
}

module.exports = { fetchRate };