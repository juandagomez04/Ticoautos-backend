const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["buyer", "owner"], required: true },
        text: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
    {
        vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
        buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        messages: [messageSchema],
    },
    { timestamps: true }
);

// Una sola conversación por vehículo/comprador
conversationSchema.index({ vehicle: 1, buyer: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", conversationSchema);
