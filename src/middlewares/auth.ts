import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import user from '../models/user-model';
import { RequestUser } from '../types';
import ResponseStatus from '../types/response-codes';
import UnauthorizedError from '../utils/UnauthorizedError';
import { decode } from '../utils/create-token';

export default (req: RequestUser, res: Response, next: NextFunction) => {
	const token: string = (req as Request).headers['x-auth-user'] as string;
	if (!token) {
		res.status(ResponseStatus.UNAUTHORIZED).send('Unauthorized');
		return;
	}
	const data = decode(token);
	if (!data) {
		res.status(ResponseStatus.UNAUTHORIZED).send('Unauthorized');
		return;
	}

	user
		.findByEmail((data as JwtPayload).email)
		.then((user) => {
			if (!user) {
				throw new UnauthorizedError('Unauthorized');
			}
			req.user = user;
			next();
		})
		.catch((error) => {
			if (error instanceof UnauthorizedError) {
				res.status(ResponseStatus.UNAUTHORIZED).send('Unauthorized');
				return;
			}
			console.error(error);
			res
				.status(ResponseStatus.INTERNAL_SERVER_ERROR)
				.send('Something went wrong');
		});
};
