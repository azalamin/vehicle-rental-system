import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: ("admin" | "customer")[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const accessToken = req.headers.authorization?.split(" ")[1];

		if (!accessToken) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized access!",
			});
		}

		const decoded = jwt.verify(accessToken!, config.jwt_secret!) as JwtPayload;

		req.user = decoded;

		if (roles.length && !roles.includes(decoded.role)) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized access!",
			});
		}
		next();
	};
};

export default auth;
