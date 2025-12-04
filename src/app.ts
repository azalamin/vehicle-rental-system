import express, { Request, Response } from "express";
import initDB from "./config/db";

const app = express();

// json parser
app.use(express.json());

// database initialized
initDB();

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: "Welcome to Vehicle Rental System",
	});
});

export default app;
