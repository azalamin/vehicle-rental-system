import { pool } from "../../config/db";
import calculateDays from "../../helpers/calculateDays";
import { status } from "./booking.constant";

const createBooking = async (payload: Record<string, unknown>) => {
	const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
	const vehicleResult = await pool.query(
		`SELECT vehicle_name, daily_rent_price FROM vehicles WHERE id=$1`,
		[vehicle_id]
	);

	const vehicle = vehicleResult.rows[0];
	const days = calculateDays(rent_start_date as string, rent_end_date as string);
	const totalRentPrice = vehicle.daily_rent_price * days;

	const result = await pool.query(
		`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
		[customer_id, vehicle_id, rent_start_date, rent_end_date, totalRentPrice, status.active]
	);

	return { ...result.rows[0], vehicle };
};

const getAllBooking = async () => {
	const result = await pool.query(`SELECT * FROM bookings`);

	return result;
};

export const bookingServices = {
	createBooking,
	getAllBooking,
};
