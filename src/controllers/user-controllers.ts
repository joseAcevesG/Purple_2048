// cspell: ignore uuidv
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import userModel from '../models/user-model';
import { RequestUser, User } from '../types';
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
			leader: 0,
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
			leader: req.body.leader || req.user.leader,
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
		let i = 0;
		for (i = 0; i < req.user.bests.length; i++) {
			if (req.body.score > req.user.bests[i].score) {
				break;
			}
		}
		req.user.bests.splice(i, 0, req.body);
		req.user.bests = req.user.bests.slice(0, 5);
	}
}

export default new UsersController();
