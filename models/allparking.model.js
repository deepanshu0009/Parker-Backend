var mongoose = require("mongoose");

function getAllParkingSchema() {
    var SchemaClass = mongoose.Schema;
    var colSchema = new SchemaClass({
        email: { type: String, required: true, unique: true, index: true },
        name: { type: String, default: "" },
        size: { type: String, default: "" },
        rate: { type: String, default: "" },
        number: { type: String, default: "" },
        country: { type: String, default: "" },
        state: { type: String, default: "" },
        city: { type: String, default: "" },
        location: { type: String, default: "" },
        zip: { type: String, default: "" },
        ppic: { type: String, default: null }, // Path to the parking picture
        date: { type: Date, default: Date.now }, // Automatically set the creation date
    }, {
        versionKey: false // To avoid the __v field in the collection
    });

    // Check if the model already exists before defining it
    return mongoose.models.allparkings || mongoose.model("allparkings", colSchema);
}

module.exports = getAllParkingSchema;