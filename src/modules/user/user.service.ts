import { pool } from "../../config/db";

const getUsers = async () => {
	return await pool.query(`SELECT id, name, email, phone, role FROM users`);
};

const updateUser = async (payload: Record<string, unknown>, userId: string) => {
	const { name, email, phone, role } = payload;
	return await pool.query(
		`UPDATE users SET name = $1, email = LOWER($2), phone = $3, role = $4 WHERE id = $5 RETURNING name, email, phone, role, id`,
		[name, email, phone, role, userId]
	);
};

export const userServices = {
	getUsers,
	updateUser,
};
