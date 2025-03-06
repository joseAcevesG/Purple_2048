import type { User } from "../types";
import BadRequestError from "../utils/BadRequestError";
import NotFoundError from "../utils/NotFoundError";
import mongoModel from "./mongo-model";

class userModel {
	findByUsername(username: string) {
		return mongoModel
			.findOne({ username })
			.then((user) => {
				if (!user) {
					throw new NotFoundError("User not found");
				}

				return user;
			})
			.catch((err) => {
				if (err instanceof NotFoundError) {
					throw new NotFoundError("Not Found");
				}
				console.error(err);
				throw err;
			});
	}

	create(data: User) {
		return mongoModel
			.create(data)
			.then(() => data)
			.catch((err) => {
				if (err.code === 11000) {
					throw new BadRequestError("Email already or Username already exists");
				}
				if (err.name === "ValidationError") {
					throw new BadRequestError("Invalid data");
				}
				console.error(err);
				throw err;
			});
	}

	update(data: User) {
		const { email } = data;

		return mongoModel
			.updateOne({ email }, data)
			.then(() => data)
			.catch((err) => {
				if (err.code === 11000) {
					throw new BadRequestError("Email already or Username already exists");
				}
				if (err.name === "ValidationError") {
					throw new BadRequestError("Invalid data");
				}
				console.error(err);
				throw err;
			});
	}

	delete(email: string) {
		return mongoModel
			.deleteOne({ email })
			.then(() => {})
			.catch((err) => {
				console.error(err);
				throw err;
			});
	}
}

export default new userModel();
