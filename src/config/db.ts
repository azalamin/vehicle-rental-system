import { Pool } from "pg";
import config from ".";

export const pool = new Pool({ connectionString: `${config.connection_str}` });

const initDB = async () => {
	await pool.query(`CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NUll,
        password TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer'
        )`);

	await pool.query(`CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(150) NOT NULL,
        type VARCHAR(20) NOT NUll CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(20) UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL,
        availability_status VARCHAR(20) DEFAULT 'available'
        )`);

	await pool.query(`CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id  INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date TEXT,
        rent_end_date TEXT,
        total_price INT NOT NULL,
        status VARCHAR(20) DEFAULT 'available'
        )`);
};

export default initDB;
