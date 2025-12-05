import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
	try {
		const result = await bookingServices.createBooking(req.body);
		res.status(201).json({
			success: true,
			message: "Booking created successfully",
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
		});
	}
};

const getAllBooking = async (req: Request, res: Response) => {
	try {
		const result = await bookingServices.getAllBooking();
		res.status(200).json({
			success: true,
			message: "Bookings retrieved successfully",
			data: result.rows,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
		});
	}
};

export const bookingControllers = {
	createBooking,
	getAllBooking,
};
