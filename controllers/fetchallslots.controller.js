var getAllParkingSchema = require("../models/allparking.model");
var getParkingSlotSchema = require("../models/parkingslot.model");

async function fetchAllBookedSlotsByClient(req, resp) {
  try {
    const { email } = req.query; // Client email

    if (!email) {
      return resp.status(400).send({ status: false, message: "Client email is required" });
    }

    // 1. Get all parking owner emails
    const allParkingColRef = getAllParkingSchema();
    const ownerEmails = await allParkingColRef.distinct("email");

    let allBookedSlots = [];

    // 2. For each owner, fetch slots booked by this client
    for (const ownerEmail of ownerEmails) {
      const parkingSlotColRef = getParkingSlotSchema(ownerEmail);
      const slots = await parkingSlotColRef.find({ email }); // slots booked by this client
      if (slots.length > 0) {
        allBookedSlots.push({
          owner: ownerEmail,
          slots
        });
      }
    }

    resp.status(200).send({
      status: true,
      message: "Booked slots fetched successfully",
      data: allBookedSlots
    });
  } catch (err) {
    console.error("Error fetching booked slots:", err);
    resp.status(500).send({ status: false, message: "Failed to fetch booked slots", details: err.message });
  }
}

module.exports.fetchAllBookedSlotsByClient = fetchAllBookedSlotsByClient;