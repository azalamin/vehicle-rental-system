import { Request, Response } from "express";
import { StatusCode } from "./booking.constant";
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
		const result = await bookingServices.getAllBooking(req);
		if (result.length === 0) {
			res.status(404).json({
				success: true,
				message: "No bookings found!!",
				data: result,
			});
		} else {
			res.status(200).json({
				success: true,
				message: "Bookings retrieved successfully",
				data: result,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
		});
	}
};
const updateBooking = async (req: Request, res: Response) => {
	try {
		const result = await bookingServices.updateBooking(req, req.params.bookingId as string);

		if (result.status === StatusCode.returned) {
			return res.status(200).json({
				success: true,
				message: "Booking marked as returned. Vehicle is now available",
				data: result,
			});
		}

		return res.status(200).json({
			success: true,
			message: "Booking cancelled successfully",
			data: result?.rows,
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
	updateBooking,
};
