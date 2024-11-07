const { DataTypes } = require('sequelize');
const sequelize = require('./db-config');

const UserModel = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.BIGINT,
			autoIncrement: true,
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
			type: DataTypes.JSON, // Utiliza JSON para almacenar arreglos o estructuras anidadas
			allowNull: true,
		},
		bests: {
			type: DataTypes.JSON, // También JSON aquí para almacenar el array
			allowNull: true,
		},
		leader: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		tableName: 'users',
		timestamps: false, // Si no usas createdAt y updatedAt
	},
);

export default UserModel;
