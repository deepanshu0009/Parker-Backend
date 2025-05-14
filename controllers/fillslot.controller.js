var getParkingSlotSchema = require("../models/parkingslot.model");



async function fetchFreeSpace(req, resp) {
  try {
    const { name } = req.query; // Extract parking name from query parameters

    // Validate input
    if (!name) {
      return resp.status(400).send({ status: false, message: "Parking name is required" });
    }

    var parkingSlotColRef = getParkingSlotSchema(name);

    // Find all slots where `available` is true
    const freeSlots = await parkingSlotColRef.find({ available: true });

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
    const { aemail, slotno, email, name, number, licenseplate, model } = req.body; // Extract details from the request body

    // Validate input
    if (!aemail || !slotno || !email) {
      return resp.status(400).send({ status: false, message: "Admin email, slot number, and user email are required to book a slot" });
    }

    // Get the parking slot collection for the admin
    var parkingSlotColRef = getParkingSlotSchema(aemail);
 
    // Ensure `slotno` is treated as a number
    const numericSlotno = Number(slotno);

    // Find the specific slot by slot number
    const slot = await parkingSlotColRef.findOne({ slotno: numericSlotno });

    if (!slot) {
      return resp.status(404).send({ status: false, message: "Slot not found" });
    }

    if (!slot.available) {
      return resp.status(400).send({ status: false, message: "Slot is already booked" });
    }

    // Update the slot with booking details
    slot.email = email;
    slot.name = name || "";
    slot.number = number || "";
    slot.licenseplate = licenseplate || "";
    slot.model = model || "";
    slot.available = false;
    slot.date = new Date();

    // Save the updated slot
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