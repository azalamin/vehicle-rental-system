import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createVehicle = async (req: Request, res: Response) => {
	try {
		const result = await bookingServices.createBooking(req.body);
		res.status(201).json({
			success: true,
			message: "Vehicle created successfully",
			data: result.rows[0],
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
		});
	}
};

export const bookingControllers = {
	createVehicle,
};
