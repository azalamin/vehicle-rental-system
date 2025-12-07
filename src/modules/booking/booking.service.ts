import { Request } from "express";
import { pool } from "../../config/db";
import calculateDays from "../../helpers/calculateDays";
import decodedUser from "../../helpers/decodedUser";
import { isEnumValue } from "../../helpers/isEnumValue";
import { Roles } from "../auth/auth.constant";
import { StatusCode } from "./booking.constant";

const createBooking = async (payload: Record<string, unknown>) => {
	const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

	const vehicleResult = await pool.query(
		`SELECT vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id=$1`,
		[vehicle_id]
	);

	if (vehicleResult.rows.length === 0) {
		throw new Error("Vehicle is not found");
	}

	const vehicle = vehicleResult.rows[0];

	if (vehicle.availability_status !== "available") {
		throw new Error("Vehicle is not available at this moment!");
	}

	const days = calculateDays(rent_start_date as string, rent_end_date as string);

	const totalRentPrice = vehicle.daily_rent_price * days;

	const result = await pool.query(
		`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
		[customer_id, vehicle_id, rent_start_date, rent_end_date, totalRentPrice, StatusCode.active]
	);

	await pool.query(
		`UPDATE vehicles SET availability_status='booked' WHERE id=$1 AND availability_status='available'`,
		[vehicle_id]
	);

	delete vehicle.availability_status;

	return { ...result.rows[0], vehicle };
};

const getAllBooking = async (req: Request) => {
	const currentUser = decodedUser(req);

	await pool.query(
		`WITH updated_bookings AS (
		UPDATE bookings SET status = 'returned' WHERE status='active'
		AND rent_end_date::timestamp < NOW()
		RETURNING vehicle_id
		)
		UPDATE vehicles SET availability_status = 'available'
		WHERE id IN (SELECT vehicle_id FROM updated_bookings)
		`
	);

	if (currentUser.role === Roles.admin) {
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
			[currentUser.id]
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

const updateBooking = async (req: Request, bookingId: string) => {
	const updatedStatus = req.body.status;

	if (!isEnumValue(StatusCode, updatedStatus)) {
		throw new Error("Invalid status code");
	}

	const currentUser = decodedUser(req);

	// CUSTOMER CANCEL BOOKING
	if (currentUser.role === Roles.customer && updatedStatus === "cancelled") {
		const result = await pool.query(
			`
			UPDATE bookings
			SET status = $1
			WHERE id = $2
			  AND customer_id = $3
			  AND status = 'active'
			  AND rent_start_date::timestamp > NOW()
			RETURNING *;
			`,
			[updatedStatus, bookingId, currentUser.id]
		);

		if (result.rowCount === 0) {
			throw new Error("You cannot cancel this booking");
		}

		return result;
	}

	// ADMIN RETURN BOOKING
	if (currentUser.role === Roles.admin && updatedStatus === "returned") {
		const result = await pool.query(
			`
			UPDATE bookings
			SET status = $1
			WHERE id = $2
			  AND status = 'cancelled'
			RETURNING *;
			`,
			[updatedStatus, bookingId]
		);

		if (result.rowCount === 0) {
			throw new Error("Booking not found or not active");
		}

		// Admin can now restore vehicle to available
		await pool.query(
			`UPDATE vehicles SET availability_status='available' WHERE id=$1 AND availability_status='booked'`,
			[result.rows[0].vehicle_id]
		);

		return result;
	}

	throw new Error("Invalid booking update request");
};

export const bookingServices = {
	createBooking,
	getAllBooking,
	updateBooking,
};
