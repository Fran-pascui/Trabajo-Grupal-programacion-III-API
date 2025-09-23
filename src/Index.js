import express from "express";
import port from "./configs.js";
import { sequelize } from "./db.js";
import hotelRoutes from "./routes/hotel.routes.js";

import "./models/index.js";

const app = express();

try {
	app.use(express.json());
	app.use("/api", hotelRoutes); 
	await sequelize.sync();
	app.listen(port);
	console.log(`App listening on port ${port}`);
} catch (error) {
	console.log("There was an error on initialization:", error);
}