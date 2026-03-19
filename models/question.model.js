const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
        askedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
