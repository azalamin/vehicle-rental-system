import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";
import calculateDays from "../../helpers/calculateDays";
import { Roles } from "../auth/auth.constant";
import { Status } from "./booking.constant";

const createBooking = async (payload: Record<string, unknown>) => {
	const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

	const vehicleResult = await pool.query(
		`SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id=$1`,
		[vehicle_id]
	);

	if (vehicleResult.rows.length === 0) {
		throw new Error("Vehicle is not found");
	}

	const vehicle = vehicleResult.rows[0];

	const days = calculateDays(rent_start_date as string, rent_end_date as string);

	const totalRentPrice = vehicle.daily_rent_price * days;

	const result = await pool.query(
		`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
		[customer_id, vehicle_id, rent_start_date, rent_end_date, totalRentPrice, Status.active]
	);

	return { ...result.rows[0], vehicle };
};

const getAllBooking = async (req: Request) => {
	const accessToken = req.headers.authorization?.split(" ")[1];
	const decode = jwt.verify(accessToken as string, config.jwt_secret as string) as JwtPayload;

	if (decode.role === Roles.admin) {
		const result = await pool.query(`
			SELECT
			bookings.id,
			bookings.vehicle_id,
			bookings.rent_start_date,
			bookings.rent_end_date,
			bookings.total_price,
			bookings.status,
			users.name AS customer_name,
			users.email AS customer_email,
			vehicles.vehicle_name,
			vehicles.registration_number
			FROM bookings
			JOIN users ON bookings.customer_id = users.id
			JOIN vehicles ON bookings.vehicle_id = vehicles.id
			ORDER BY bookings.id DESC
	`);

		// formatted the database data according to user & admin
		const formatted = result.rows.map(row => ({
			id: row.id,
			customer_id: row.customer_id,
			vehicle_id: row.vehicle_id,
			rent_start_date: row.rent_start_date,
			rent_end_date: row.rent_end_date,
			total_price: row.total_price,
			status: row.status,
			customer: {
				name: row.customer_name,
				email: row.customer_email,
			},
			vehicle: {
				vehicle_name: row.vehicle_name,
				registration_number: row.registration_number,
			},
		}));

		return formatted;
	} else {
		const result = await pool.query(
			`
			SELECT
			bookings.id,
			bookings.vehicle_id,
			bookings.rent_start_date,
			bookings.rent_end_date,
			bookings.total_price,
			bookings.status,
			vehicles.vehicle_name,
			vehicles.registration_number,
			vehicles.type
			FROM bookings
			JOIN vehicles ON bookings.vehicle_id = vehicles.id
			WHERE bookings.customer_id=$1
			ORDER BY bookings.id DESC
	`,
			[decode.id]
		);

		// formatted the database data according to user & admin
		const formatted = result.rows.map(row => ({
			id: row.id,
			customer_id: row.customer_id,
			vehicle_id: row.vehicle_id,
			rent_start_date: row.rent_start_date,
			rent_end_date: row.rent_end_date,
			total_price: row.total_price,
			status: row.status,
			vehicle: {
				vehicle_name: row.vehicle_name,
				registration_number: row.registration_number,
			},
		}));

		return formatted;
	}
};

export const bookingServices = {
	createBooking,
	getAllBooking,
};
