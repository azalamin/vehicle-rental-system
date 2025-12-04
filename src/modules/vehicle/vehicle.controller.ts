import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
	try {
		const result = await vehicleServices.createVehicle(req.body);
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

const getAllVehicles = async (req: Request, res: Response) => {
	try {
		const result = await vehicleServices.getAllVehicles();
		res.status(200).json({
			success: true,
			message: "Vehicles retrieved successfully",
			data: result.rows,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
		});
	}
};

const getSingleVehicle = async (req: Request, res: Response) => {
	try {
		const result = await vehicleServices.getSingleVehicle(req.params.vehicleId as string);
		res.status(200).json({
			success: true,
			message: "Vehicle retrieved successfully",
			data: result.rows,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
		});
	}
};

export const vehicleControllers = {
	createVehicle,
	getAllVehicles,
	getSingleVehicle,
};
