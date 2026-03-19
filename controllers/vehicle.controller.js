const Vehicle = require("../models/vehicle.model");

// GET /api/vehicles/my  →  vehículos del usuario autenticado
async function getMyVehicles(req, res) {
    try {
        const vehicles = await Vehicle.find({ owner: req.user.id }).sort({ createdAt: -1 });
        return res.json(vehicles);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// GET /api/vehicles  →  búsqueda pública con filtros
async function getVehicles(req, res) {
    try {
        const { brand, model, minYear, maxYear, minPrice, maxPrice, status } = req.query;

        const filter = {};

        if (brand) filter.brand = { $regex: brand, $options: "i" };
        if (model) filter.model = { $regex: model, $options: "i" };
        if (status) filter.status = status;

        if (minYear || maxYear) {
            filter.year = {};
            if (minYear) filter.year.$gte = Number(minYear);
            if (maxYear) filter.year.$lte = Number(maxYear);
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const vehicles = await Vehicle.find(filter)
            .populate("owner", "name lastName")
            .sort({ createdAt: -1 });

        return res.json(vehicles);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

async function getVehicleById(req, res) {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate("owner", "name lastName");
        if (!vehicle) return res.status(404).json({ message: "Vehículo no encontrado." });
        return res.json(vehicle);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// POST /api/vehicles  →  crear vehículo
async function createVehicle(req, res) {
    try {
        const { brand, model, year, price, status, transmission, fuel, mileage, color, location, description, images } = req.body;

        if (!brand || !model || !year || !price || !transmission || !fuel || mileage === undefined || !color || !location || !description) {
            return res.status(400).json({ message: "Faltan campos obligatorios." });
        }

        const vehicle = await Vehicle.create({
            brand: brand.trim(),
            model: model.trim(),
            year: Number(year),
            price: Number(price),
            status: status || "disponible",
            transmission,
            fuel,
            mileage: Number(mileage),
            color: color.trim(),
            location: location.trim(),
            description: description.trim(),
            images: images || [],
            owner: req.user.id,
        });

        return res.status(201).json(vehicle);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// PUT /api/vehicles/:id  →  editar vehículo
async function updateVehicle(req, res) {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) return res.status(404).json({ message: "Vehículo no encontrado." });
        if (vehicle.owner.toString() !== req.user.id) return res.status(403).json({ message: "No autorizado." });

        const { brand, model, year, price, status, transmission, fuel, mileage, color, location, description, images } = req.body;

        if (brand) vehicle.brand = brand.trim();
        if (model) vehicle.model = model.trim();
        if (year) vehicle.year = Number(year);
        if (price) vehicle.price = Number(price);
        if (status) vehicle.status = status;
        if (transmission) vehicle.transmission = transmission;
        if (fuel) vehicle.fuel = fuel;
        if (mileage !== undefined) vehicle.mileage = Number(mileage);
        if (color) vehicle.color = color.trim();
        if (location) vehicle.location = location.trim();
        if (description) vehicle.description = description.trim();
        if (images) vehicle.images = images;

        await vehicle.save();
        return res.json(vehicle);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// DELETE /api/vehicles/:id  →  eliminar vehículo
async function deleteVehicle(req, res) {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) return res.status(404).json({ message: "Vehículo no encontrado." });
        if (vehicle.owner.toString() !== req.user.id) return res.status(403).json({ message: "No autorizado." });

        await vehicle.deleteOne();
        return res.json({ message: "Vehículo eliminado correctamente." });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// PATCH /api/vehicles/:id/status  →  cambiar estado (disponible/vendido/reservado)
async function updateStatus(req, res) {
    try {
        const { status } = req.body;
        const allowed = ["disponible", "reservado", "vendido"];

        if (!allowed.includes(status)) return res.status(400).json({ message: "Estado inválido." });

        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) return res.status(404).json({ message: "Vehículo no encontrado." });
        if (vehicle.owner.toString() !== req.user.id) return res.status(403).json({ message: "No autorizado." });

        vehicle.status = status;
        await vehicle.save();
        return res.json(vehicle);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

async function reserveVehicle(req, res) {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: "Vehículo no encontrado." });

        // El propietario no puede reservar su propio vehículo
        if (vehicle.owner.toString() === req.user.id) {
            return res.status(403).json({ message: "No puedes reservar tu propio vehículo." });
        }

        const { action } = req.body; // "reservar" o "cancelar"

        if (action === "reservar") {
            if (vehicle.status !== "disponible") {
                return res.status(409).json({ message: "El vehículo no está disponible para reservar." });
            }
            vehicle.status = "reservado";
            vehicle.reservedBy = req.user.id;
        } else if (action === "cancelar") {
            if (vehicle.status !== "reservado") {
                return res.status(409).json({ message: "El vehículo no está reservado." });
            }
            // Solo quien reservó puede cancelar
            if (vehicle.reservedBy?.toString() !== req.user.id) {
                return res.status(403).json({ message: "No autorizado para cancelar esta reserva." });
            }
            vehicle.status = "disponible";
            vehicle.reservedBy = null;
        } else {
            return res.status(400).json({ message: "Acción inválida. Use 'reservar' o 'cancelar'." });
        }

        await vehicle.save();
        return res.json(vehicle);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

module.exports = { getVehicles, getMyVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle, updateStatus, reserveVehicle };