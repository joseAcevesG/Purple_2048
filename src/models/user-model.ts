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
        console.log(user);
        return dynUser
          .getUser(user.id)
          .then((response) => {
            return {
              id: user.id,
              email: user.email,
              password: user.password,
              username: user.username,
              saveBoards: user.saveBoards,
              bests: response.Item.bests,
              leader: response.Item.leader,
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
      leader: data.leader,
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
      leader: data.leader,
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
