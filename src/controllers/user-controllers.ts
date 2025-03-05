// cspell: ignore uuidv
import type { Request, Response } from "express";
import mongoModel from "../models/mongo-model";
import userModel from "../models/user-model";
import type { BestsItem, RequestUser, User } from "../types";
import ResponseStatus from "../types/response-codes";
import BadRequestError from "../utils/BadRequestError";
import NotFoundError from "../utils/NotFoundError";
import UnauthorizedError from "../utils/UnauthorizedError";
import { code as createToken } from "../utils/create-token";
import hashPassword from "../utils/hash-password";

class UsersController {
	signUp(req: Request, res: Response) {
		const data: User = {
			email: req.body.email,
			password: hashPassword(req.body.password),
			username: req.body.username,
			saveBoards: [],
			bests: [],
		};

		userModel
			.create(data)
			.then((user: User) => {
				res.status(ResponseStatus.CREATED).send({
					token: createToken({ name: user.username, email: user.email }),
				});
			})
			.catch((err: Error) => {
				if (err instanceof BadRequestError) {
					if (err.message === "Invalid data") {
						res.status(ResponseStatus.BAD_REQUEST).send("Invalid data");
						return;
					}
					res
						.status(ResponseStatus.BAD_REQUEST)
						.send("Email already or Username already exists");
					return;
				}
				console.error(err);
				res
					.status(ResponseStatus.INTERNAL_SERVER_ERROR)
					.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
			});
	}

	logIn(req: Request, res: Response) {
		userModel
			.findByUsername(req.body.username)
			.then((user: User) => {
				if (hashPassword(req.body.password) !== user.password) {
					throw new UnauthorizedError("Unauthorized");
				}
				res.status(ResponseStatus.SUCCESS).send({
					token: createToken({ name: user.username, email: user.email }),
				});
			})
			.catch((err: Error) => {
				if (err instanceof UnauthorizedError) {
					res
						.status(ResponseStatus.UNAUTHORIZED)
						.send("password or email is incorrect");
					return;
				}
				if (err instanceof NotFoundError) {
					res
						.status(ResponseStatus.NOT_FOUND)
						.send("password or email is incorrect");
					return;
				}
				if (err instanceof BadRequestError) {
					res.status(ResponseStatus.BAD_REQUEST).send("Invalid data");
					return;
				}
				console.error(err);
				res
					.status(ResponseStatus.INTERNAL_SERVER_ERROR)
					.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
			});
	}

	getUser(req: RequestUser, res: Response) {
		res.status(ResponseStatus.SUCCESS).send(req.user);
	}

	updateUser(req: RequestUser, res: Response) {
		if (
			req.body.password &&
			hashPassword(req.body.oldPassword) !== req.user.password
		) {
			res.status(ResponseStatus.UNAUTHORIZED).send("password is incorrect");
			return;
		}
		const password = req.body.password
			? hashPassword(req.body.password)
			: req.user.password;

		const data: User = {
			id: req.user.id,
			email: req.body.email || req.user.email,
			password: password,
			username: req.body.username || req.user.username,
			saveBoards: req.body.saveBoards || req.user.saveBoards,
			bests: req.body.bests || req.user.bests,
		};

		userModel
			.update(data)
			.then((user: User) => {
				res.status(ResponseStatus.SUCCESS).send(user);
			})
			.catch((err: Error) => {
				if (err instanceof BadRequestError) {
					res.status(ResponseStatus.BAD_REQUEST).send("User already exists");
					return;
				}
				console.error(err);
				res
					.status(ResponseStatus.INTERNAL_SERVER_ERROR)
					.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
			});
	}

	deleteUser(req: RequestUser, res: Response) {
		userModel
			.delete(req.user.email)
			.then(() => {
				res.status(ResponseStatus.SUCCESS).send({ message: "User deleted" });
			})
			.catch((err: Error) => {
				if (err instanceof NotFoundError) {
					res.status(ResponseStatus.SUCCESS).send({ message: "User deleted" });
					return;
				}
				console.error(err);
				res
					.status(ResponseStatus.INTERNAL_SERVER_ERROR)
					.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
			});
	}

	getBestScores(req: RequestUser, res: Response) {
		if (!req.query.index) {
			res.status(ResponseStatus.SUCCESS).send(req.user.bests);
			return;
		}
		const index = Number.parseInt(req.query.index as string, 10);
		if (index >= req.user.bests.length) {
			res.status(ResponseStatus.BAD_REQUEST).send("Index out of bounds");
			return;
		}
		res.status(ResponseStatus.SUCCESS).send(req.user.bests[index]);
	}

	updateBestScores(req: RequestUser, res: Response) {
		if (
			req.user.bests.length === 5 &&
			req.user.bests[req.user.bests.length - 1].score > req.body.score
		) {
			res
				.status(ResponseStatus.SUCCESS)
				.send({ message: "Score not high enough" });
			return;
		}

		let i = 0;
		for (i = 0; i < req.user.bests.length; i++) {
			if (req.body.score > req.user.bests[i].score) {
				break;
			}
		}
		req.user.bests.splice(i, 0, req.body);
		req.user.bests = req.user.bests.slice(0, 5);

		mongoModel
			.where("leader")
			.gt(0)
			.then((leaders: User[]) => {
				if (leaders.length === 0) {
					req.user.leader++;
					return userModel.update(req.user);
				}
				const sortLeaders = leaders
					.flatMap((leader: User) => {
						return leader.bests
							.map((best: BestsItem) => {
								return best.score;
							})
							.slice(0, leader.leader)
							.map((score) => {
								return { id: leader.id, score: score };
							});
					})
					.sort((a, b) => {
						return b.score - a.score;
					});
				console.log({ sortLeaders });

				if (sortLeaders.length < 5) {
					req.user.leader++;
					return userModel.update(req.user);
				}

				console.log({
					userScore: req.body.score,
					lastLeaderScore: sortLeaders[sortLeaders.length - 1].score,
					isLesThan: req.body.score < sortLeaders[sortLeaders.length - 1].score,
				});

				if (req.body.score < sortLeaders[sortLeaders.length - 1].score) {
					return userModel.update(req.user);
				}

				i = 0;
				for (i = 0; i < sortLeaders.length; i++) {
					if (req.body.score > sortLeaders[i].score) {
						break;
					}
				}
				console.log({ i });

				sortLeaders.splice(i, 0, { id: req.user.id, score: req.body.score });
				const lastLeader = leaders.find((leader: User) => {
					return leader.id === sortLeaders[sortLeaders.length - 1].id;
				});
				if (lastLeader.id === req.user.id) {
					return userModel.update(req.user);
				}

				req.user.leader++;
				const updateUser = userModel.update(req.user);

				lastLeader.leader--;
				const updateLats = userModel.update(lastLeader);

				return Promise.all([updateUser, updateLats]).then(() => updateUser);
			})
			.then(() => {
				res.status(ResponseStatus.SUCCESS).send({ message: "Leader updated" });
			})
			.catch((err) => {
				console.error(err);
				res
					.status(ResponseStatus.INTERNAL_SERVER_ERROR)
					.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
			});
	}

	saveBoard(req: RequestUser, res: Response) {
		const index = req.user.saveBoards.findIndex(
			(board) => board.name === req.body.name,
		);

		if (index !== -1) {
			req.user.saveBoards.splice(index, 1);
		}

		if (req.user.saveBoards.length === 5) {
			req.user.saveBoards.pop();
		}

		req.user.saveBoards.unshift({
			name: req.body.name,
			board: req.body.board,
			score: req.body.score,
		});

		const data: User = {
			id: req.user.id,
			email: req.user.email,
			password: req.user.password,
			username: req.user.username,
			saveBoards: req.user.saveBoards,
			bests: req.user.bests,
		};

		userModel
			.update(data)
			.then(() => {
				res.status(ResponseStatus.SUCCESS).send({ message: "Board saved" });
			})
			.catch((err: Error) => {
				if (err instanceof BadRequestError) {
					res.status(ResponseStatus.BAD_REQUEST).send("User already exists");
					return;
				}
				console.error(err);
				res
					.status(ResponseStatus.INTERNAL_SERVER_ERROR)
					.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
			});
	}

	getSaveBoards(req: RequestUser, res: Response) {
		if (!req.query.index) {
			res.status(ResponseStatus.SUCCESS).send(req.user.saveBoards);
			return;
		}
		const index = Number.parseInt(req.query.index as string, 10);
		if (index >= req.user.saveBoards.length) {
			res.status(ResponseStatus.BAD_REQUEST).send("Index out of bounds");
			return;
		}
		res.status(ResponseStatus.SUCCESS).send(req.user.saveBoards[index]);
	}

	getLeaders(_req: RequestUser, res: Response) {
		mongoModel
			.where("leader")
			.gt(0)
			.then((leaders: User[]) => {
				if (leaders.length === 0) {
					res.status(ResponseStatus.SUCCESS).send([]);
					return;
				}
				console.log({ leaders });
				const sortLeaders = leaders
					.flatMap((leader: User) => {
						return leader.bests
							.map((best: BestsItem) => {
								return best.score;
							})
							.slice(0, leader.leader)
							.map((score) => {
								return { username: leader.username, score: score };
							});
					})
					.sort((a, b) => {
						return b.score - a.score;
					});

				res.status(ResponseStatus.SUCCESS).send(sortLeaders);
			})
			.catch((err: Error) => {
				console.error(err);
				res
					.status(ResponseStatus.INTERNAL_SERVER_ERROR)
					.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
			});
	}
}

export default new UsersController();
