import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import routes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {
	console.log(`App is running in ${port}`);
});
