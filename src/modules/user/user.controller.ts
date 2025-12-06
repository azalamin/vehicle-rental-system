import { Request, Response } from "express";
import decodedUser from "../../helpers/decodedUser";
import { Roles } from "../auth/auth.constant";
import { userServices } from "./user.service";

const getUsers = async (req: Request, res: Response) => {
	try {
		const result = await userServices.getUsers();
		res.status(200).json({
			success: true,
			message: "Users retrieved successfully",
			data: result.rows,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
		});
	}
};

const updateUser = async (req: Request, res: Response) => {
	try {
		const currentUser = decodedUser(req);
		if (currentUser.role === Roles.admin || currentUser.id === req.params.userId) {
			const result = await userServices.updateUser(req, req.params.userId!);
			return res.status(200).json({
				success: true,
				message: "User updated successfully",
				data: result.rows[0],
			});
		} else {
			return res.status(401).json({
				success: false,
				message: "Unauthorized access!",
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
			error: error,
		});
	}
};

const deleteUser = async (req: Request, res: Response) => {
	try {
		await userServices.deleteUser(req.params.userId!);
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
		});
	}
};

export const userControllers = {
	getUsers,
	updateUser,
	deleteUser,
};
