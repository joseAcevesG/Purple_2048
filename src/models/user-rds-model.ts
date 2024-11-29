import { DataTypes, Model, Optional } from 'sequelize';
import { User } from '../types';
import sequelize from './rds-config';

interface UserCreationAttributes extends Optional<User, 'id' | 'saveBoards'> {}

// Clase UserModel con Sequelize y tipado
class UserModel extends Model<User, UserCreationAttributes> {}

// Inicialización del modelo
UserModel.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		saveBoards: {
			type: DataTypes.JSON,
			allowNull: true,
		},
	},
	{
		sequelize,
		tableName: 'users',
		timestamps: true,
	},
);

export default UserModel;
