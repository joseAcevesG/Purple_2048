import path from "node:path";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import routes from "./routes";

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "../public")));
app.use(routes);

async function start() {
	const db_url = process.env.DB_URL;
	try {
		await mongoose.connect(db_url);
		console.log("Connected to db");
		app.listen(port, () => {
			if (process.env.NODE_ENV === "dev") {
				console.log(`Server running on port ${port}`);
			} else {
				console.log("Server running");
			}
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

start();
