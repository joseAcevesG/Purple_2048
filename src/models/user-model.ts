import { User, UserDyn, UserRds } from '../types';
import dynUser from './user-dyn-model';
import rdsModel from './user-rds-model';
const dummyUser: User = {
	email: 'test@test',
	password: 'test',
	username: 'test',
};

class userModel {
	findByEmail(email: string) {
		return rdsModel
			.findOne({ where: { email } })
			.then((user) => {
				if (!user) {
					throw new Error('User not found');
				}

				// Usa el método .get() para acceder a los datos del modelo
				const userData = user.get() as UserRds;

				return dynUser
					.getUser(userData.id)
					.then((response) => {
						return {
							id: userData.id,
							email: userData.email,
							password: userData.password,
							username: userData.username,
							saveBoards: userData.saveBoards,
							bests: response.Item?.bests,
							leader: response.Item?.leader,
						};
					})
					.catch((err) => {
						console.error(err);
						throw new Error('Error updating user');
					});
			})
			.catch((err) => {
				console.error(err);
				throw new Error('Error updating user');
			});
	}
	create(data: User) {
		const dynData: UserDyn = {
			id: data.id,
			bests: data.bests,
		};

		const rdsData: UserRds = {
			id: data.id,
			email: data.email,
			password: data.password,
			username: data.username,
			saveBoards: data.saveBoards,
		};

		const dynPromise = dynUser.saveUser(dynData);
		const rdsPromise = rdsModel.create(rdsData);

		return Promise.all([dynPromise, rdsPromise])
			.then(() => data)
			.catch((err) => {
				console.error(err);
				throw new Error('Error creating user');
			});
	}

	update(data: User) {
		const dynData: UserDyn = {
			id: data.id,
			bests: data.bests,
		};

		const rdsData: UserRds = {
			id: data.id,
			email: data.email,
			password: data.password,
			username: data.username,
			saveBoards: data.saveBoards,
		};

		const dynPromise = dynUser.saveUser(dynData);
		const rsdPromise = rdsModel.update(rdsData, { where: { id: data.id } });

		return Promise.all([dynPromise])
			.then(() => data)
			.catch((err) => {
				console.error(err);
				throw new Error('Error updating user');
			});
	}

	delete(id: string) {
		const dynPromise = dynUser.deleteUser(id);
		const rdsPromise = rdsModel.destroy({ where: { id: id } });

		return Promise.all([dynPromise])
			.then(() => {})
			.catch((err) => {
				console.error(err);
				throw new Error('Error deleting user');
			});
	}
}

export default new userModel();
