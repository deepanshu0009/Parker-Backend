var getParkingSlotSchema = require("../models/parkingslot.model");

var parkingSlotColRef = getParkingSlotSchema();

async function fetchFreeSpace(req, resp) {
  try {
    const { name } = req.query; // Extract parking name from query parameters

    // Validate input
    if (!name) {
      return resp.status(400).send({ status: false, message: "Parking name is required" });
    }

    // Find all slots for the given parking name (document name)
    const freeSlots = await parkingSlotColRef.find({ aemail: name, email: "" }); // Empty email indicates free slots

    if (freeSlots.length === 0) {
      return resp.status(404).send({ status: false, message: "No free slots available" });
    }

    // Get the first available slot
    const availableSlot = freeSlots[0];

    // Respond with the single available slot
    resp.status(200).send({
      status: true,
      message: "Available slot fetched successfully",
      slot: availableSlot,
    });
  } catch (err) {
    console.error("Error fetching free slots:", err);
    resp.status(500).send({ status: false, message: "Failed to fetch free slots", details: err.message });
  }
}

async function bookSlot(req, resp) {
  try {
    const { slotno, email, name, number, licenseplate, model } = req.body; // Extract details from the request body

    // Validate input
    if (!slotno || !email) {
      return resp.status(400).send({ status: false, message: "Slot number and email are required to book a slot" });
    }

    // Find the slot by slotno and ensure it is free
    const slot = await parkingSlotColRef.findOne({ slotno, email: "" }); // Empty email indicates the slot is free

    if (!slot) {
      return resp.status(404).send({ status: false, message: "Slot not available or already booked" });
    }

    // Update the slot with booking details
    slot.email = email;
    slot.name = name || "";
    slot.number = number || "";
    slot.licenseplate = licenseplate || "";
    slot.model = model || "";

    const updatedSlot = await slot.save();

    // Respond with success
    resp.status(200).send({
      status: true,
      message: "Slot booked successfully",
      slot: updatedSlot,
    });
  } catch (err) {
    console.error("Error booking slot:", err);
    resp.status(500).send({ status: false, message: "Failed to book slot", details: err.message });
  }
}

module.exports = { fetchFreeSpace, bookSlot };