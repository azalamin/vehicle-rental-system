import { pool } from "../../config/db";
import dynamicUpdate from "../../helpers/dynamicUpdate";
import { isEnumValue } from "../../helpers/isEnumValue";
import { Roles } from "../auth/auth.constant";

const getUsers = async () => {
	const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
	if (result.rows.length === 0) {
		throw new Error("NO users found!");
	}
	return result;
};

const updateUser = async (payload: Record<string, unknown>, userId: string) => {
	// validate role if provided
	if (payload.role !== undefined) {
		if (!isEnumValue(Roles, payload.role)) {
			throw new Error("Invalid role value. Allowed: admin, customer");
		}
	}

	const { fields, values, index } = dynamicUpdate(payload, userId);
	const result = await pool.query(
		`UPDATE users SET ${fields.join(
			", "
		)} WHERE id = $${index} RETURNING id, name, email, phone, role`,
		[...values]
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
