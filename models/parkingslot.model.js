var mongoose = require("mongoose");

function getParkingSlotSchema() {
    var SchemaClass = mongoose.Schema;
    var colSchema = new SchemaClass({
        aemail: { type: String, required: true, index: true }, // Admin email
        email: { type: String, required: true }, // User email
        name: { type: String, default: "" },
        number: { type: String, default: "" },
        licenseplate: { type: String, default: "" },
        model: { type: String, default: "" },
        slotno: { type: String, required: true }, // Slot number is required
        date: { type: Date, default: Date.now }, // Automatically set the creation date
    }, {
        versionKey: false // To avoid the __v field in the collection
    });

    // Check if the model already exists before defining it
    return mongoose.models.parkingslots || mongoose.model("parkingslots", colSchema);
}

module.exports = getParkingSlotSchema;