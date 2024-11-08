// models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { SaveBoardsItem, User } from '../types';
import sequelize from './rds-config';

// Definimos una interfaz para los atributos opcionales al crear un nuevo usuario
interface UserCreationAttributes
	extends Optional<User, 'id' | 'saveBoards' | 'leader'> {}

// Creamos la clase del modelo de usuario extendiendo Model
class UserModel extends Model<User, UserCreationAttributes> implements User {
	public id!: string;
	public email!: string;
	public password!: string;
	public username!: string;
	public saveBoards?: SaveBoardsItem[];
	public leader?: number;
	public token?: string;

	// Timestamps automáticos
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

// Inicializamos el modelo
UserModel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
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
			type: DataTypes.JSON, // Usamos JSON si el array puede contener estructuras complejas
			allowNull: true,
		},
	},
	{
		sequelize, // La instancia de conexión
		tableName: 'users',
		timestamps: true, // Esto agregará createdAt y updatedAt automáticamente
	},
);

export default UserModel;
