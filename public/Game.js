// cSpell:ignore 2vmin Leaderboard
import Grid from '/assets/Grid.js';
import Tile from '/assets/Tile.js';
import {
	bestScores,
	createUser,
	deleteUser,
	editUser,
	initData,
	leaderBoard,
	loadGames,
	login,
	logout,
	makeRequest,
} from '/assets/Users.js';

const gameBoard = document.getElementById('game-board');

let grid;
let gridCopy;
let score;
let best;
let xTouch;
let yTouch;

//init page
window.addEventListener('load', async function () {
	if (document.firstElementChild.getAttribute('pag') === 'board') {
		if (this.localStorage.token === undefined) this.window.location.href = '/';
		this.window.newGame = newGame;
		this.window.logout = logout;
		this.window.bestScores = bestScores;
		this.window.loadGames = loadGames;
		this.window.leaderBoard = leaderBoard;
		this.window.saveGame = saveGame;
		this.window.loadGame = loadGame;
		this.window.bestScore = bestScore;
		this.window.editUser = editUser;
		this.window.deleteUser = deleteUser;
		await initData();
		best = Number.parseInt(
			document.getElementById('best').innerHTML.substring(6),
		);
	} else {
		this.window.login = login;
		this.window.createUser = createUser;
		if (this.localStorage.token !== undefined) window.location.href = '/game';
	}
});

window.addEventListener('touchmove', (e) => {
	e.preventDefault();
});

$('#modalSave').on('hidden.bs.modal', () => {
	document.getElementById('saveName').value = '';
	setupInput();
});

$('#modalEdit').on('shown.bs.modal', () => {
	document.getElementById('updateUsername').value = document
		.getElementById('username')
		.innerHTML.substring(10);
	document.getElementById('updateEmail').value = document
		.getElementById('email')
		.innerHTML.substring(7);
	document.getElementById('oldPassword').value = '';
	document.getElementById('updatePassword').value = '';
	document.getElementById('passwordConfirm').value = '';
});

$('#modalEdit').on('hidden.bs.modal', () => {
	document.getElementById('oldPassword').value = '';
	document.getElementById('updatePassword').value = '';
	document.getElementById('passwordConfirm').value = '';
	setupInput();
});

$('#modalCreate').on('hidden.bs.modal', () => {
	document.getElementById('newUsername').value = '';
	document.getElementById('newEmail').value = '';
	document.getElementById('newPassword').value = '';
	document.getElementById('confPassword').value = '';
	setupInput();
});

$('#showBoard').on('hidden.bs.modal', () => {
	grid = gridCopy;
	setupInput();
});

// Funcion que muestra el tab de los mejores puntajes.
async function bestScore(index) {
	try {
		let best = await makeRequest('GET', `/user/bestScores?index=${index}`, {
			'Content-Type': 'application/json',
			'x-auth-user': localStorage.token,
		});
		best = JSON.parse(best);
		const board = document.getElementById('bestGame-board');
		const children = board.children;
		for (let i = children.length - 1; i >= 0; i--) {
			board.removeChild(children[i]);
		}
		gridCopy = grid;
		grid = new Grid(board, best.board);

		document.getElementById('bestScore').innerHTML = `Score: ${best.score}`;
	} catch (e) {
		console.log(e);
		alert(`${e.status}: ${e.response}`);
	}
}

// Funcion que carga un juego guardado.
async function loadGame(index) {
	let save = await makeRequest('GET', `/user/saveGames?index=${index}`, {
		'Content-Type': 'application/json',
		'x-auth-user': localStorage.token,
	});
	save = JSON.parse(save);
	document.getElementById('gameOver').style.display = 'none';
	gameBoard.classList.remove('over');
	const children = gameBoard.children;
	for (let i = children.length - 1; i >= 0; i--) {
		gameBoard.removeChild(children[i]);
	}
	grid = new Grid(gameBoard, save.board);

	document.getElementById('score').innerHTML = `Score: ${save.score}`;
	score = save.score;
	if (score > best) {
		document.getElementById('best').innerHTML = `Best: ${score}`;
	}
	$('#loadGame').modal('hide');
	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		gameOver();
	} else setupInput();
}

// Funcion que inicia un nuevo juego.
function newGame() {
	document.getElementById('gameOver').style.display = 'none';
	gameBoard.classList.remove('over');
	const children = gameBoard.children;
	for (let i = children.length - 1; i >= 0; i--) {
		gameBoard.removeChild(children[i]);
	}
	grid = new Grid(gameBoard);

	document.getElementById('score').innerHTML = 'Score: 0';
	score = 0;

	grid.randomEmptyCell().tile = new Tile(gameBoard);
	grid.randomEmptyCell().tile = new Tile(gameBoard);

	setupInput();
}

// Funcion que termina el juego.
async function gameOver() {
	gameBoard.classList.add('over');
	document.getElementById('gameOver').style.display = 'flex';
	const bestSave = {
		board: grid.grid,
		score: score,
	};

	try {
		// Guardar el mejor puntaje.
		await makeRequest(
			'PUT',
			'/user/bestScores',
			{
				'Content-Type': 'application/json',
				'x-auth-user': localStorage.token,
			},
			bestSave,
		);
	} catch (e) {
		console.log(e);
		alert(`${e.status}: ${e.response}`);
	}
}

// Funcion que guarda un juego.
async function saveGame(saveInput = false) {
	let flag = true;
	const children = document.getElementById('loads').children;
	for (let i = 0; i < children.length; i++) {
		if (
			children[i].getAttribute('saveName') ===
			document.getElementById('saveName').value
		) {
			flag = false;
			break;
		}
	}
	const save = saveInput
		? true
		: document.getElementById('loads').children.length < 5 && flag;
	if (save) {
		const gameSave = {
			name: document.getElementById('saveName').value,
			board: grid.grid,
			score: score,
		};
		try {
			// Guardar el juego.
			const action = await makeRequest(
				'PUT',
				'/user/saveGames',
				{
					'Content-Type': 'application/json',
					'x-auth-user': localStorage.token,
				},
				gameSave,
			);
			alert(action);
			$('#modalSave').modal('hide');
		} catch (e) {
			console.log(e);
			alert(`${e.status}: ${e.response}`);
		}
	} else {
		// Mostrar mensaje de advertencia.
		if (!flag)
			document.getElementById('warningMessage1').innerHTML =
				`Are you sure you want to replace ${document.getElementById('saveName').value}`;
		else {
			document.getElementById('warningMessage1').innerHTML =
				`Are you sure you want to delete your oldest save game? (${children[0].getAttribute('saveName')})`;
		}
		$('#modalWarning').modal({ show: true });
	}
}

// Funcion que elimina un juego guardado.
function setupInput() {
	window.addEventListener('keydown', handleInput, { once: true });
	window.addEventListener(
		'touchstart',
		(e) => {
			xTouch = e.touches[0].clientX;
			yTouch = e.touches[0].clientY;
		},
		{ once: true },
	);
	window.addEventListener(
		'touchend',
		(e) => {
			const xMove = e.changedTouches[0].clientX;
			const yMove = e.changedTouches[0].clientY;
			const move = {};
			if (xTouch - xMove >= 100 || xTouch - xMove <= -100) {
				if (xTouch > xMove) move.key = 'ArrowLeft';
				else move.key = 'ArrowRight';
			} else if (yTouch - yMove >= 100 || yTouch - yMove <= -100) {
				if (yTouch > yMove) move.key = 'ArrowUp';
				else move.key = 'ArrowDown';
			}
			handleInput(move);
		},
		{ once: true },
	);
}

// Funcion que maneja la entrada del usuario.
async function handleInput(e) {
	if ($('#Leaderboard').hasClass('show')) {
		setupInput();
		return;
	}
	if ($('#bestScores').hasClass('show')) {
		setupInput();
		return;
	}
	if ($('#loadGame').hasClass('show')) {
		setupInput();
		return;
	}
	if ($('#showBoard').hasClass('show')) {
		setupInput();
		return;
	}
	if ($('#userInfo').hasClass('show')) {
		setupInput();
		return;
	}
	if ($('#modalEdit').hasClass('show')) {
		setupInput();
		return;
	}
	if ($('#modalSave').hasClass('show')) {
		setupInput();
		return;
	}
	if ($('#modalWarning').hasClass('show')) {
		setupInput();
		return;
	}

	if ($('#modalDelete').hasClass('show')) {
		setupInput();
		return;
	}
	if ($('#modalCreate').hasClass('show')) {
		setupInput();
		return;
	}
	switch (e.key) {
		case 'ArrowUp':
			if (!canMoveUp()) {
				setupInput();
				return;
			}
			await moveUp();
			break;
		case 'ArrowDown':
			if (!canMoveDown()) {
				setupInput();
				return;
			}
			await moveDown();
			break;
		case 'ArrowLeft':
			if (!canMoveLeft()) {
				setupInput();
				return;
			}
			await moveLeft();
			break;
		case 'ArrowRight':
			if (!canMoveRight()) {
				setupInput();
				return;
			}
			await moveRight();
			break;
		default:
			setupInput();
			return;
	}
	for (const cellArr of grid.cells) {
		for (const cell of cellArr) {
			score = cell.mergeTiles(score);
		}
	}

	const newTile = new Tile(gameBoard);
	grid.randomEmptyCell().tile = newTile;

	if (score > best) {
		document.getElementById('best').innerHTML = `Best: ${score}`;
		best = score;
	} else {
		document.getElementById('best').innerHTML = `Best: ${best}`;
	}
	if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		newTile.waitForTransition(true).then(() => {
			gameOver();
		});
		return;
	}

	setupInput();
}

// Funcion que mueve las fichas hacia arriba.
function moveUp() {
	return slideTiles(grid.cellsByColumn);
}

// Funcion que mueve las fichas hacia abajo.
function moveDown() {
	return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

// Funcion que mueve las fichas hacia la izquierda.
function moveLeft() {
	return slideTiles(grid.cellsByRow);
}

// Funcion que mueve las fichas hacia la derecha.
function moveRight() {
	return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

// Funcion que desliza las fichas.
function slideTiles(cells) {
	return Promise.all(
		cells.flatMap((group) => {
			const promises = [];
			for (let i = 1; i < group.length; i++) {
				const cell = group[i];
				if (cell.tile == null) continue;
				let lastValidCell;
				for (let j = i - 1; j >= 0; j--) {
					const moveToCell = group[j];
					if (!moveToCell.canAccept(cell.tile)) break;
					lastValidCell = moveToCell;
				}

				if (lastValidCell != null) {
					promises.push(cell.tile.waitForTransition());
					if (lastValidCell.tile != null) {
						lastValidCell.mergeTile = cell.tile;
					} else {
						lastValidCell.tile = cell.tile;
					}
					cell.tile = null;
				}
			}
			return promises;
		}),
	);
}

// Funciones que determinan si se pueden mover las fichas.

function canMoveUp() {
	return canMove(grid.cellsByColumn);
}

function canMoveDown() {
	return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
	return canMove(grid.cellsByRow);
}

function canMoveRight() {
	return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
	for (let i = 0; i < cells.length; i++) {
		for (let j = 0; j < cells[i].length; j++) {
			if (j === 0) continue;
			if (cells[i][j].tile == null) continue;
			const moveToCell = cells[i][j - 1];
			if (moveToCell.canAccept(cells[i][j].tile)) return true;
		}
	}
	return false;
}
