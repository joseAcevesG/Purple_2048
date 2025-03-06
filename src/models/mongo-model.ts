import { Schema, model } from "mongoose";

const schema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	saveBoards: {
		type: [],
	},
	bests: {
		type: [],
	},
	leader: {
		type: Number,
		default: 0,
	},
});

export default model("users", schema);
