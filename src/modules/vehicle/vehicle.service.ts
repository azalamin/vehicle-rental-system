import { pool } from "../../config/db";
import dynamicUpdate from "../../helpers/dynamicUpdate";
import { isEnumValue } from "../../helpers/isEnumValue";
import { AvailabilityStatus, VehicleTypes } from "./vehicle.constant";

const createVehicle = async (payload: Record<string, unknown>) => {
	const { vehicle_name, type, registration_number, daily_rent_price, availability_status } =
		payload;

	if (!isEnumValue(VehicleTypes, type)) {
		throw new Error("Invalid vehicle type!");
	}

	if (!isEnumValue(AvailabilityStatus, availability_status)) {
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
	return await pool.query(`DELETE FROM vehicles WHERE id=$1 AND availability_status='available'`, [
		id,
	]);
};

const updateVehicle = async (payload: Record<string, unknown>, id: string) => {
	const { fields, values, index } = dynamicUpdate(payload, id);

	const result = await pool.query(
		`UPDATE vehicles SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
		[...values]
	);

	return result;
};

export const vehicleServices = {
	createVehicle,
	getAllVehicles,
	getSingleVehicle,
	deleteVehicle,
	updateVehicle,
};
