const dynamicUpdate = (payload: Record<string, unknown>, id: string) => {
	const fields = [];
	const values: unknown[] = [];
	let index = 1;

	// Dynamically build update field
	for (const [key, value] of Object.entries(payload)) {
		if (value !== undefined) {
			if (key === "email") {
				fields.push(`email = LOWER($${index})`); // email will be lower case in DB
			} else {
				fields.push(`${key} = $${index}`); // becomes like ["name" = $1,....]
			}
			values.push(value); //becomes like [John Doe]
			index++;
		}
	}

	// return error if no input received from client
	if (fields.length === 0) {
		throw new Error("No data provided for update");
	}

	// add id to last value
	values.push(id);

	return { fields, values, index };
};

export default dynamicUpdate;
