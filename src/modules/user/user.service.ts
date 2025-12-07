import { pool } from "../../config/db";

const getUsers = async () => {
	const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
	if (result.rows.length === 0) {
		throw new Error("NO users found!");
	}
	return result;
};

const updateUser = async (payload: Record<string, unknown>, userId: string) => {
	const { name, email, phone, role } = payload;

	const result = await pool.query(
		`UPDATE users SET name = $1, email = LOWER($2), phone = $3, role = $4 WHERE id = $5 RETURNING id, name, email, phone, role`,
		[name, email, phone, role, userId]
	);

	if (result.rowCount === 0) {
		throw new Error("User not found");
	}

	return result;
};

const deleteUser = async (userId: string) => {
	const result = await pool.query(
		`DELETE FROM users WHERE id=$1 AND NOT EXISTS(SELECT 1 FROM bookings WHERE bookings.customer_id = users.id AND bookings.status = 'active')`,
		[userId]
	);

	if (result.rowCount !== 1) {
		throw new Error("User cannot be deleted or user not found!");
	}

	return result;
};

export const userServices = {
	getUsers,
	updateUser,
	deleteUser,
};
