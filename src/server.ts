import app from "./app";
import config from "./config";

app.listen(config.port, () => {
	console.log(`Vehicle Rental System app is listening on the port ${config.port}`);
});
