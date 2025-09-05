import express from "express";
import port from "./configs.js";
import { sequelize } from "./db.js";
import hotelRoutes from "./routes/hotel.routes.js";

import "./models/index.js";

const app = express();

try {
	app.listen(port);
	app.use(hotelRoutes);
	await sequelize.sync();
	console.log("app listening in port ", port);
} catch (error) {
	console.log("there was an error on initilization");
}
