import express, { Request, Response } from "express";

const app = express();

// json parser
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: "Welcome to Vehicle Rental System",
	});
});

export default app;
