import { DataTypes, Model, Optional } from 'sequelize';
import { SaveBoardsItem, User } from '../types';
import sequelize from './rds-config';

// Define la interfaz para atributos opcionales
interface UserCreationAttributes
	extends Optional<User, 'id' | 'saveBoards' | 'leader'> {}

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
