// cspell: ignore uuidv
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dynModel from '../models/user-dyn-model';
import userModel from '../models/user-model';
import { RequestUser, User, UserDyn, leaderBoardMember } from '../types';
import ResponseStatus from '../types/response-codes';
import NotFoundError from '../utils/NotFoundError';
import UnauthorizedError from '../utils/UnauthorizedError';
import { code as createToken } from '../utils/create-token';
import hashPassword from '../utils/hash-password';

class UsersController {
	signUp(req: Request, res: Response) {
		const data: User = {
			id: uuidv4(),
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
				console.error(err);
				res
					.status(ResponseStatus.INTERNAL_SERVER_ERROR)
					.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
			});
	}

	logIn(req: Request, res: Response) {
		userModel
			.findByEmail(req.body.email)
			.then((user: User) => {
				if (hashPassword(req.body.password) !== user.password) {
					throw new UnauthorizedError('Unauthorized');
				}
				res.status(ResponseStatus.SUCCESS).send({
					token: createToken({ name: user.username, email: user.email }),
				});
			})
			.catch((err: Error) => {
				if (err instanceof UnauthorizedError) {
					res
						.status(ResponseStatus.UNAUTHORIZED)
						.send('password or email is incorrect');
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
			res.status(ResponseStatus.UNAUTHORIZED).send('password is incorrect');
			return;
		}
		const data: User = {
			id: req.user.id,
			email: req.body.email || req.user.email,
			password: hashPassword(req.body.password) || req.user.password,
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
				console.error(err);
				res
					.status(ResponseStatus.INTERNAL_SERVER_ERROR)
					.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
			});
	}

	deleteUser(req: RequestUser, res: Response) {
		userModel
			.delete(req.user.id)
			.then(() => {
				res.status(ResponseStatus.SUCCESS).send('User deleted');
			})
			.catch((err: Error) => {
				console.error(err);
				res
					.status(ResponseStatus.INTERNAL_SERVER_ERROR)
					.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
			});
	}

	getBestScores(req: RequestUser, res: Response) {
		res.status(ResponseStatus.SUCCESS).send(req.user.bests);
	}

	updateBestScores(req: RequestUser, res: Response) {
		if (req.user.bests[req.user.bests.length - 1].score > req.body.score) {
			res.status(ResponseStatus.SUCCESS).send('Score not high enough');
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

		const data: UserDyn = {
			id: req.user.id,
			bests: req.user.bests,
		};

		dynModel
			.saveUser(data)
			.then(() => {
				return dynModel.getLeaders();
			})
			.then((response) => {
				const leaders = response.Item as leaderBoardMember[];
				if (leaders[leaders.length - 1].score > req.body.score) {
					res.status(ResponseStatus.SUCCESS).send('Score not high enough');
					return;
				}
				for (i = 0; i < leaders.length; i++) {
					if (leaders[i].score > req.body.score) {
						break;
					}
				}
				leaders.splice(i, 0, { id: req.user.id, score: req.body.score });
				const newLeaders = leaders.slice(0, 5);
				return dynModel.saveLeaders(newLeaders);
			})
			.catch((err: Error) => {
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
				res.status(ResponseStatus.SUCCESS).send('Board saved');
			})
			.catch((err: Error) => {
				console.error(err);
				res
					.status(ResponseStatus.INTERNAL_SERVER_ERROR)
					.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
			});
	}

	getSaveBoards(req: RequestUser, res: Response) {
		res.status(ResponseStatus.SUCCESS).send(req.user.saveBoards);
	}

	getLeaders(req: Request, res: Response) {
		dynModel
			.getLeaders()
			.then((response) => {
				const leaders = response.Item as leaderBoardMember[];
				res.status(ResponseStatus.SUCCESS).send(leaders);
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
