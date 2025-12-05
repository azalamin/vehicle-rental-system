import express, { Request, Response } from "express";
import initDB from "./config/db";
import { bookingRoutes } from "./modules/booking/booking.route";
import { vehicleRoutes } from "./modules/vehicle/vehicle.route";

const app = express();

// json parser
app.use(express.json());

// database initialized
initDB();

// Vehicle Routes
app.use("/api/v1/vehicles", vehicleRoutes);

// Booking Routes
app.use("/api/v1/bookings", bookingRoutes);

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: "Welcome to Vehicle Rental System",
	});
});

export default app;
