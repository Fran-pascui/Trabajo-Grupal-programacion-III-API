import express from "express";
import {
	getAllServices,
	getAllServicesAdmin,
	getServiceById,
	createService,
	updateService,
	deleteService,
	restoreService,
	deleteServicePermanently,
} from "../services/services.services.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const services = await getAllServices();
		res.json(services);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const service = await getServiceById(id);
		res.json(service);
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

router.get("/admin/all", async (req, res) => {
	try {
		const services = await getAllServicesAdmin();
		res.json(services);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/admin/create", async (req, res) => {
	try {
		const serviceData = req.body;
		const newService = await createService(serviceData);
		res.status(201).json(newService);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.put("/admin/update/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const serviceData = req.body;
		const updatedService = await updateService(id, serviceData);
		res.json(updatedService);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.delete("/admin/delete/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const result = await deleteService(id);
		res.json(result);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.put("/admin/restore/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const result = await restoreService(id);
		res.json(result);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.delete("/admin/delete-permanent/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const result = await deleteServicePermanently(id);
		res.json(result);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

export default router;
