const { Sequelize } = require('sequelize');
const { config } = require('dotenv');
config();

// console.log(process.env.DATABASE_NAME);
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);
// console.log(process.env.RDS_ENDPOINT);

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
