const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const inboxRoutes = require("./routes/inbox.routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/inbox", inboxRoutes);


app.get("/", (req, res) => {
    res.send("REST API funcionando 🚀");
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado ✅"))
    .catch((err) => console.error("Error MongoDB:", err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));