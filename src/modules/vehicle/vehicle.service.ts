import { pool } from "../../config/db";
import { VehicleTypes } from "./vehicle.constant";

const createVehicle = async (payload: Record<string, unknown>) => {
	const { vehicle_name, type, registration_number, daily_rent_price, availability_status } =
		payload;

	if (!Object.values(VehicleTypes).includes(type as any)) {
		throw new Error("Invalid vehicle type!");
	}

	const result = await pool.query(
		`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
		[vehicle_name, type, registration_number, daily_rent_price, availability_status]
	);

	return result;
};

const getAllVehicles = async () => {
	return await pool.query(`SELECT * FROM vehicles`);
};

const getSingleVehicle = async (id: string) => {
	return await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
};

const deleteVehicle = async (id: string) => {
	return await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
};

const updateVehicle = async (payload: Record<string, unknown>, id: string) => {
	const { vehicle_name, type, registration_number, daily_rent_price, availability_status } =
		payload;
	return await pool.query(
		`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
		[vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
	);
};

export const vehicleServices = {
	createVehicle,
	getAllVehicles,
	getSingleVehicle,
	deleteVehicle,
	updateVehicle,
};
