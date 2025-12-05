import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
	const { customer_id } = payload;
	const result = await pool.query(`INSERT`);

	return result;
};

export const bookingServices = {
	createBooking,
};
