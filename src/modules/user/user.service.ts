import { Request } from "express";
import { pool } from "../../config/db";

const getUsers = async () => {
	const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
	if (result.rows.length === 0) {
		throw new Error("NO users found!");
	}
	return result;
};

const updateUser = async (req: Request, userId: string) => {
	const { name, email, phone, role } = req.body;
	const result = await pool.query(
		`UPDATE users SET name = $1, email = LOWER($2), phone = $3, role = $4 WHERE id = $5 RETURNING name, email, phone, role, id`,
		[name, email, phone, role, userId]
	);

	if (result.rowCount === 0) {
		throw new Error("User not found");
	}

	return result;
};

const deleteUser = async (userId: string) => {
	const result = await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);

	if (result.rowCount !== 1) {
		throw new Error("No users found!");
	}

	return result;
};

export const userServices = {
	getUsers,
	updateUser,
	deleteUser,
};
