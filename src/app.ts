import express, { Request, Response } from "express";
import initDB from "./config/db";
import { vehicleRoutes } from "./modules/vehicle/vehicle.route";

const app = express();

// json parser
app.use(express.json());

// database initialized
initDB();

// Vehicle Routes
app.use("/api/v1/vehicles", vehicleRoutes);

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: "Welcome to Vehicle Rental System",
	});
});

export default app;
