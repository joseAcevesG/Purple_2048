import path from 'node:path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import routes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, '../public')));
app.use(routes);

if (process.env.NODE_ENV === 'dev') {
	app.use('/assets', express.static(path.join(__dirname, '../public')));
} else {
	app.use('/assets', express.static(path.join(__dirname, 'public')));
}

app.listen(port, () => {
	if (process.env.NODE_ENV === 'dev') {
		console.log(`Server running on port ${port}`);
	} else {
		console.log('Server running');
	}
});
