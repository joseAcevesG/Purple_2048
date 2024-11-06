// cSpell:ignore randomatic

import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import chalk from 'chalk';
import cors from 'cors';
// delete
import express from 'express';
import mongoose, { get } from 'mongoose';
import randomatic from 'randomatic';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const mongoConnection =
	'mongodb+srv://admin:IpQnoc0Vjl5hZxvL@purple_2048.ap4rwmw.mongodb.net/Purple_2048';
const db = mongoose.connection;

db.on('connecting', () => {
	console.log(chalk.blue('connecting'));
});

db.on('connected', () => {
	console.log(chalk.green('connected'));
});

const app = express();
const port = 4000;

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	saveBoards: {
		type: [],
	},
	bests: {
		type: [],
	},
	leader: {
		type: Number,
		default: 0,
	},
	token: {
		type: String,
	},
});
const User = mongoose.model('users', userSchema);

async function authenticate(req, res, next) {
	if (req.originalUrl === '/api/users' && req.method === 'POST') {
		next();
		return;
	}
	if (!req.get('x-auth-user')) {
		res.status(401);
		res.send('Missing token');
		return;
	}
	try {
		const user = await User.findOne({ token: req.get('x-auth-user') });
		if (user === undefined) {
			res.status(401);
			res.send('Invalid token');
			return;
		}
		req.id = user._id;
		next();
	} catch (e) {
		console.log(chalk.red(e));
		res.status(500);
		res.send('Fatal Error');
	}
}

app.use(
	cors({
		methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
	}),
);
app.use(express.json());

app.use(express.static(__dirname));

app.use('/api/users', authenticate);
app.use('/api/users/bestScores', authenticate);
app.use('/api/users/saveGames', authenticate);
app.use('/api/users/leaders', authenticate);

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, './FRONTEND/login.html'));
});

//YA route, controller
app.put('/api/login', async (req, res) => {
	let v = false;
	let text = 'The following attributes are missing: ';
	if (req.body.username === undefined) {
		v = true;
		text += 'username, ';
	}
	if (req.body.password === undefined) {
		v = true;
		text += 'password, ';
	}
	if (v) {
		res.status(400);
		res.send(text.substring(0, text.length - 2));
		return;
	}

	try {
		const user = await User.findOne({ username: req.body.username });
		if (user == null) {
			res.status(401);
			res.send("User doesn't exist");
			return;
		}
		if (!bcrypt.compareSync(req.body.password, user.password)) {
			res.status(401);
			res.send('Incorrect password');
			return;
		}
		if (user.token === undefined) {
			user.token = `${randomatic('Aa0', '10')}-${user._id}`;
			await user.save();
		}
		res.send(user.token);
	} catch (e) {
		console.log(chalk.red(e));
		res.status(500);
		res.send('Fatal Error');
	}
});

//YA route, controller
app.get('/api/users', async (req, res) => {
	try {
		const user = await User.findById(req.id);
		res.send(user);
	} catch (e) {
		console.log(chalk.red(e));
		res.status(500);
		res.send('Fatal Error');
	}
});

//YA route, controller
app.post('/api/users', async (req, res) => {
	let v = false;
	let text = 'The following attributes are missing: ';
	if (req.body.email === undefined) {
		v = true;
		text += 'email, ';
	}
	if (req.body.password === undefined) {
		v = true;
		text += 'password, ';
	}
	if (req.body.username === undefined) {
		v = true;
		text += 'username, ';
	}
	if (v) {
		res.status(400);
		res.send(text.substring(0, text.length - 2));
		return;
	}
	try {
		let user = await User.find({ username: req.body.username });
		if (user.length !== 0) {
			res.status(400);
			res.send('Username already exist');
			return;
		}
		req.body.password = bcrypt.hashSync(req.body.password, 10);
		user = await User(req.body);
		await user.save();
		res.status(201);
		res.send(user);
	} catch (e) {
		console.log(chalk.red(e));
		res.status(500);
		res.send('Fatal Error');
	}
});

//YA route controller
app.put('/api/users', async (req, res) => {
	try {
		let user = await User.findById(req.id);
		if (
			req.body.oldPassword !== undefined &&
			!bcrypt.compareSync(req.body.oldPassword, user.password)
		) {
			res.status(401);
			res.send('Wrong password');
			return;
		}
		if (req.body.password !== undefined) {
			req.body.password = bcrypt.hashSync(req.body.password, 10);
		}
		if (req.body.username !== undefined) {
			const usernameUnique = await User.find({ username: req.body.username });
			if (usernameUnique.length !== 0) {
				res.status(400);
				res.send('Username already exists...');
				return;
			}
		}
		user = Object.assign(user, req.body);
		await user.save();
		res.send(JSON.stringify(user));
	} catch (e) {
		console.log(chalk.red(e));
		res.status(500);
		res.send('Fatal Error');
	}
});

//YA route
app.delete('/api/users', async (req, res) => {
	try {
		await User.deleteOne({ _id: req.id });
		res.send();
	} catch (e) {
		console.log(chalk.red(e));
		res.status(500);
		res.send('Fatal Error');
	}
});

//YA route
app.get('/api/users/bestScores', async (req, res) => {
	try {
		if (req.query.index === undefined) {
			const best = await User.findById(req.id).select('bests -_id');
			res.send(JSON.stringify(best));
			return;
		}
		const best = await User.findById(req.id).select('bests -_id');
		res.send(JSON.stringify(best.bests[req.query.index]));
	} catch (e) {
		console.log(chalk.red(e));
		res.status(500);
		res.send('Fatal Error');
	}
});

//YA route
app.put('/api/users/bestScores', async (req, res) => {
	try {
		const user = await User.findById(req.id);
		if (user.bests === undefined) {
			user.bests = [];
		}
		let i;
		for (i = 0; i < user.bests.length; i++) {
			if (req.body.score > user.bests[i].score) break;
		}
		user.bests.splice(i, 0, req.body);
		if (user.bests.length > 5) {
			user.bests.pop();
		}

		const saves = await User.where('leader').gt(0);

		if (saves.length === 0) {
			user.leader += 1;
		} else {
			let cnt = 0;
			let lastBest = saves[0];
			for (const item of saves) {
				if (
					item.bests[item.leader - 1].score <
					lastBest.bests[item.leader - 1].score
				)
					lastBest = item;
				cnt += item.leader;
			}
			if (
				cnt === 5 &&
				lastBest.bests[lastBest.leader - 1].score < req.body.score
			) {
				if (user.username !== lastBest.username) {
					user.leader += 1;
					lastBest.leader -= 1;
					await lastBest.save();
				}
			} else if (cnt < 5) {
				user.leader += 1;
			}
		}
		await user.save();
		res.send('Save successfully');
	} catch (e) {
		console.log(chalk.red(e));
		res.status(500);
		res.send('Fatal Error');
	}
});

// YA route
app.get('/api/users/saveGames', async (req, res) => {
	try {
		if (req.query.index === undefined) {
			const saves = await User.findById(req.id).select('saveBoards -_id');
			res.send(JSON.stringify(saves));
			return;
		}
		const saves = await User.findById(req.id).select('saveBoards -_id');
		res.send(JSON.stringify(saves.saveBoards[req.query.index]));
	} catch (e) {
		console.log(chalk.red(e));
		res.status(500);
		res.send('Fatal Error');
	}
});

//YA route
app.put('/api/users/saveGames', async (req, res) => {
	try {
		const user = await User.findById(req.id);

		const index = user.saveBoards.findIndex(
			(item) => item.name === req.body.name,
		);
		if (index !== -1) {
			user.saveBoards.splice(index, 1);
		}

		if (user.saveBoards !== undefined && user.saveBoards.length === 5) {
			user.saveBoards.shift();
		}

		user.saveBoards.push(req.body);
		await user.save();
		res.send('Save successfully');
	} catch (e) {
		console.log(chalk.red(e));
		res.status(500);
		res.send('Fatal Error');
	}
});

//YA route
app.get('/api/users/leaders', async (req, res) => {
	try {
		const saves = await User.where('leader')
			.gt(0)
			.select('leader bests username -_id');
		if (saves.length === 0) {
			res.send(JSON.stringify(saves));
			return;
		}
		const leaders = [];
		for (const item of saves) {
			for (let i = 0; i < item.leader; i++) {
				leaders.push({
					username: item.username,
					score: item.bests[i].score,
				});
			}
		}

		leaders.sort((a, b) => b.score - a.score);
		res.send(JSON.stringify(leaders));
	} catch (e) {
		console.log(chalk.red(e));
		res.status(500);
		res.send('Fatal Error');
	}
});

mongoose.connect(mongoConnection, { useNewUrlParser: true });
app.listen(port, () => {
	console.log(`API running on port ${port}`);
});
