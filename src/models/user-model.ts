import { User as UserType } from '../types';

const dummyUser = {
	email: 'test@tets',
	password: '1234',
	username: 'test',
	saveBoards: [{ name: 'test', board: [{ x: 0, y: 0, value: 0 }], score: 0 }],
	bests: [{ board: [{ x: 0, y: 0, value: 0 }], score: 0 }],
	leader: 0,
};

class User {
	create(client: UserType): Promise<UserType> {
		return Promise.resolve(dummyUser);
	}

	update(client: UserType): Promise<UserType> {
		return Promise.resolve(dummyUser);
	}

	delete(id: string): Promise<void> {
		return Promise.resolve();
	}

	getAll(): Promise<UserType[]> {
		return Promise.resolve([dummyUser]);
	}

	get(id: string): Promise<UserType> {
		return Promise.resolve(dummyUser);
	}

	findByEmail(email: string): Promise<UserType> {
		return Promise.resolve(dummyUser);
	}
}

export default new User();
