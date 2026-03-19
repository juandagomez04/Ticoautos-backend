const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const {
    getVehicles,
    getMyVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    updateStatus,
    reserveVehicle,
} = require("../controllers/vehicle.controller");

// Protegidas
router.get("/my", authenticateToken, getMyVehicles);
router.post("/", authenticateToken, createVehicle);
router.put("/:id", authenticateToken, updateVehicle);
router.delete("/:id", authenticateToken, deleteVehicle);
router.patch("/:id/status", authenticateToken, updateStatus);
router.patch("/:id/reserve", authenticateToken, reserveVehicle);

// Públicas
router.get("/", getVehicles);
router.get("/:id", getVehicleById);

module.exports = router;
