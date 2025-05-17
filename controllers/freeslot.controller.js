var getAllParkingSchema = require("../models/allparking.model");
var getParkingSlotSchema = require("../models/parkingslot.model");
var allParkingColRef = getAllParkingSchema();

async function fetchRate(req, resp) {
  try {
    const { email } = req.query; 
    console.log(email);// Extract email from query parameters

    // Validate input
    if (!email) {
      return resp.status(400).send({ status: false, message: "Email is required to fetch the parking rate" });
    }

    // Find the parking by email
    const parking = await allParkingColRef.findOne({ email: email });

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

async function freeSlot(req, resp) {
  try {
    const { aemail, slotno } = req.body; // Extract admin email and slot number from the request body

    // Validate input
    if (!aemail || !slotno) {
      return resp.status(400).send({ status: false, message: "Admin email and slot number are required" });
    }

    // Debug input values
    console.log("Admin email (aemail):", aemail);
    console.log("Requested slotno:", slotno, "Type:", typeof slotno);

    // Get the parking slot collection for the admin
    var parkingSlotColRef = getParkingSlotSchema(aemail);

    // Debug collection name
    console.log("Collection name:", parkingSlotColRef.collection.name);

    // Ensure `slotno` is treated as a number
    const numericSlotno = Number(slotno);

    // Find the specific slot by slot number
    const slot = await parkingSlotColRef.findOne({ slotno: numericSlotno });

    if (!slot) {
      return resp.status(404).send({ status: false, message: "Slot not found" });
    }

    

    // Calculate the time difference (current time - time registered in slot)
const currentTime = new Date();
const registeredTime = new Date(slot.date); // Ensure date string is parsed into a Date object

console.log("Current Time:", currentTime.toISOString());
console.log("Registered Time (raw):", slot.date);
console.log("Registered Time (parsed):", registeredTime.toISOString());

const timeDifferenceInMs = Math.abs(currentTime.getTime() - registeredTime.getTime()); // Time difference in milliseconds
console.log("Time difference (ms):", timeDifferenceInMs);

const timeDifferenceInhours = Math.ceil(timeDifferenceInMs / (1000 * 60 * 60)); // Convert ms to hours
console.log("Time difference in hours:", timeDifferenceInhours);

    // Clear the slot data and make it available
    slot.email = "";
    slot.name = "";
    slot.number = "";
    slot.licenseplate = "";
    slot.model = "";
    slot.available = true;

    // Save the updated slot
    const updatedSlot = await slot.save();  

    // Respond with success and time difference
    resp.status(200).send({
      status: true,
      message: "Slot cleared and made available successfully",
      slot: updatedSlot,
      timeDifferenceInhours,
    });
  } catch (err) {
    console.error("Error freeing slot:", err);
    resp.status(500).send({ status: false, message: "Failed to free slot", details: err.message });
  }
}

module.exports = { fetchRate, freeSlot };