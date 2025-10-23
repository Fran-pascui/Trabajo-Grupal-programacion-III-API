import express from "express";
import port from "./helpers/configs.js";
import { sequelize } from "./db.js";
import hotelRoutes from "./routes/hotel.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cors from "cors";
import "./models/index.js";
const app = express();

try {
	app.use(express.json());
	app.use(
		cors({
			origin: "http://localhost:5173",
			methods: ["GET", "POST", "PUT", "DELETE"],
			credentials: true,
		})
	);
	app.use("/api", hotelRoutes);
	app.use("/api", adminRoutes);
	app.use(hotelRoutes);
	await sequelize.sync();
	app.listen(port);
	console.log(`App listening on port ${port}`);
} catch (error) {
	console.log("There was an error on initialization:", error);
}
