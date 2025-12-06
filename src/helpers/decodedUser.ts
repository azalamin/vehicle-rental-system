import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const decodedUser = (req: Request) => {
	const accessToken = req.headers.authorization?.split(" ")[1];
	const decode = jwt.verify(accessToken as string, config.jwt_secret as string) as JwtPayload;

	return decode;
};

export default decodedUser;
