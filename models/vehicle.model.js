const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        brand: { type: String, required: true, trim: true },
        model: { type: String, required: true, trim: true },
        year: { type: Number, required: true },
        price: { type: Number, required: true },
        status: {
            type: String,
            enum: ["disponible", "reservado", "vendido"],
            default: "disponible",
        },
        transmission: {
            type: String,
            enum: ["manual", "automática"],
            required: true,
        },
        fuel: {
            type: String,
            enum: ["gasolina", "diesel", "eléctrico", "híbrido"],
            required: true,
        },
        mileage: { type: Number, required: true, min: 0 },
        color: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        images: [{ type: String }],
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
