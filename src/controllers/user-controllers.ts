import { Request, Response } from 'express';
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

	//ERROR por el metodo del modelo

	// logIn(req: Request, res: Response) {
	// 	userModel
	// 		.findByEmail(req.body.email)
	// 		.then((user: User) => {
	// 			if (req.body.password !== user.password) {
	// 				throw new UnauthorizedError('Unauthorized');
	// 			}
	// 			res.status(ResponseStatus.SUCCESS).send({
	// 				token: createToken({ name: user.username, email: user.email }),
	// 			});
	// 		})
	// 		.catch((err: Error) => {
	// 			if (err instanceof UnauthorizedError) {
	// 				res
	// 					.status(ResponseStatus.UNAUTHORIZED)
	// 					.send('password or email is incorrect');
	// 				return;
	// 			}
	// 			console.error(err);
	// 			res
	// 				.status(ResponseStatus.INTERNAL_SERVER_ERROR)
	// 				.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
	// 		});
	// }

	getUser(req: RequestUser, res: Response) {
		res.status(ResponseStatus.SUCCESS).send(req.user);
	}

	updateUser(req: RequestUser, res: Response) {
		const data: User = {
			email: req.body.email,
			password: hashPassword(req.body.password),
			username: req.body.username,
			saveBoards: req.body.saveBoards,
			bests: req.body.bests,
			leader: req.body.leader,
		};

		//ERROR por el metodo del modelo

		// userModel
		// 	.update(data)
		// 	.then((user: User) => {
		// 		res.status(ResponseStatus.SUCCESS).send(user);
		// 	})
		// 	.catch((err: Error) => {
		// 		console.error(err);
		// 		res
		// 			.status(ResponseStatus.INTERNAL_SERVER_ERROR)
		// 			.send(ResponseStatus.INTERNAL_SERVER_ERROR_MESSAGE);
		// 	});
	}
}

export default new UsersController();
