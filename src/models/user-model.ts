import { User } from '../types';
const dummyUser: User = {
	email: 'test@test',
	password: 'test',
	username: 'test',
};

class userModel {
	findByEmail(email: string) {
		return new Promise<User>((resolve, reject) => {
			if (email === dummyUser.email) {
				resolve(dummyUser);
			} else {
				reject('User not found');
			}
		});
	}

	create(data: User) {
		return new Promise<User>((resolve, reject) => {
			if (data.email === dummyUser.email) {
				reject('User already exists');
			} else {
				resolve(data);
			}
		});
	}
}

export default new userModel();
