var mongoose = require("mongoose");

function getParkingSlotSchema(adminId) {
    var SchemaClass = mongoose.Schema;
    var colSchema = new SchemaClass({
        email: { type: String }, // User email
        name: { type: String, default: "" },
        number: { type: String, default: "" },
        licenseplate: { type: String, default: "" },
        model: { type: String, default: "" },
        slotno: { type: Number, required: true }, // Slot number is required
        available: { type: Boolean, default: true }, // Indicates if the slot is available
        date: { type: Date, default: Date.now }, // Automatically set the creation date
    }, {
        versionKey: false // To avoid the __v field in the collection
    });

    // Dynamically create a model for the admin ID
    const collectionName = `parkingslots_${adminId}`; // Collection name based on admin ID
    return mongoose.models[collectionName] || mongoose.model(collectionName, colSchema);
}

module.exports = getParkingSlotSchema;