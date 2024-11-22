const { Sequelize } = require('sequelize');
const { config } = require('dotenv');
config();

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.RDS_ENDPOINT,
		dialect: 'mysql',
		port: 3306,
	},
);

export default sequelize;
