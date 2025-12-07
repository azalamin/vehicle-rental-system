import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";
import { Roles } from "./auth.constant";

const signup = async (payload: Record<string, unknown>) => {
	const { name, email, password, phone, role } = payload;

	if ((password as string).length < 6) {
		throw new Error("Password character should be minimum 6");
	}

	if (role !== Roles.admin && role !== Roles.customer) {
		throw new Error("Invalid role");
	}

	const hashedPassword = await bcrypt.hash(password as string, 10);

	const result = await pool.query(
		`
        INSERT INTO users(name, email, password, phone, role) VALUES($1, LOWER($2), $3, $4, $5) RETURNING *`,
		[name, email, hashedPassword, phone, role]
	);

	delete result.rows[0].password;

	return result;
};

const signin = async (email: string, password: string) => {
	const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email.toLowerCase()]);

	if (result.rows.length === 0) {
		throw new Error("User not found");
	}

	const user = result.rows[0];

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error("Incorrect password!");
	}

	const payload = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const token = jwt.sign(payload, config.jwt_secret!, {
		expiresIn: "7d",
	});

	const accessToken = `Bearer ${token}`;

	delete user.password;

	return { accessToken, user };
};

export const authServices = {
	signup,
	signin,
};
