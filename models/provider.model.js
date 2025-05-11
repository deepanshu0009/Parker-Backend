var mongoose = require("mongoose");

function getProviderSchema() {
    var SchemaClass = mongoose.Schema;
    var colSchema = new SchemaClass({
        email: { type: String, required: true, unique: true, index: true },
        firstname: { type: String, default: "" },
        lastname: { type: String, default: "" },
        number: { type: String, default: "" },
        ppic: { type: String, default: null }, // Profile picture path
        idpic: { type: String, default: null }, // ID picture path
        date: { type: Date, default: Date.now },
    }, {
        versionKey: false // To avoid the __v field in the collection
    });

    var userColRef = mongoose.model("users", colSchema);
    return userColRef;
}

module.exports = getProviderSchema;