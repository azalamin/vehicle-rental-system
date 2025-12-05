import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signup = async (req: Request, res: Response) => {
	try {
		const result = await authServices.signup(req.body);
		res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: result.rows[0],
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
		});
	}
};

const signin = async (req: Request, res: Response) => {
	try {
		const result = await authServices.signin(req.body.email, req.body.password);
		res.status(200).json({
			success: true,
			message: "Login successful",
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: (error as Error).message,
		});
	}
};

export const authControllers = {
	signup,
	signin,
};
