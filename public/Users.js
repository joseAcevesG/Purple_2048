// cSpell:ignore Leaderboard
export {
	makeRequest,
	editUser,
	initData,
	login,
	bestScores,
	loadGames,
	leaderBoard,
	createUser,
	logout,
	deleteUser,
};

// Función para hacer una solicitud HTTP
function makeRequest(method, url, headers = undefined, body = undefined) {
	// Añadir clase 'over' al elemento principal y otros elementos según la página
	document.getElementById('main').classList.add('over');
	if (document.firstElementChild.getAttribute('pag') === 'board') {
		document.getElementById('Leaderboard').classList.add('over');
		document.getElementById('bestScores').classList.add('over');
		document.getElementById('loadGame').classList.add('over');
		document.getElementById('showBoard').classList.add('over');
		document.getElementById('userInfo').classList.add('over');
		document.getElementById('modalEdit').classList.add('over');
		document.getElementById('modalSave').classList.add('over');
		document.getElementById('modalWarning').classList.add('over');
	} else {
		document.getElementById('modalCreate').classList.add('over');
	}
	document.getElementById('lottie').style.display = 'block';

	const options = {
		method: method,
		headers: headers ? headers : {},
		body: body ? JSON.stringify(body) : undefined,
	};

	return fetch(url, options)
		.then((response) => {
			// Quitar clase 'over' de los elementos después de la respuesta
			document.getElementById('main').classList.remove('over');
			if (document.firstElementChild.getAttribute('pag') === 'board') {
				document.getElementById('Leaderboard').classList.remove('over');
				document.getElementById('bestScores').classList.remove('over');
				document.getElementById('loadGame').classList.remove('over');
				document.getElementById('showBoard').classList.remove('over');
				document.getElementById('userInfo').classList.remove('over');
				document.getElementById('modalEdit').classList.remove('over');
				document.getElementById('modalSave').classList.remove('over');
				document.getElementById('modalWarning').classList.remove('over');
			} else {
				document.getElementById('modalCreate').classList.remove('over');
			}
			document.getElementById('lottie').style.display = 'none';

			if (response.ok) {
				return response.json();
			}
			return Promise.reject({
				status: response.status,
				response: response.statusText,
			});
		})
		.catch((error) => {
			document.getElementById('lottie').style.display = 'none';
			return Promise.reject({
				status: error.status || 'Network error',
				response: error.response || 'Unable to complete request',
			});
		});
}

// Función para iniciar sesión
function login() {
	const log = {
		username: document.getElementById('username').value,
		password: document.getElementById('password1').value,
	};
	putLogin(log);
}

// Función para cerrar sesión
function logout() {
	localStorage.removeItem('token');
	window.location.href = '/';
}

// Función para crear un nuevo usuario
async function createUser() {
	try {
		if (
			document.getElementById('newPassword').value !==
			document.getElementById('confPassword').value
		) {
			alert('passwords do not match');
			return;
		}
		const user = {
			username: document.getElementById('newUsername').value,
			email: document.getElementById('newEmail').value,
			password: document.getElementById('newPassword').value,
		};

		const token = await makeRequest(
			'POST',
			'/auth/register',
			{ 'Content-Type': 'application/json' },
			user,
		);
		localStorage.setItem('token', token);
		window.location.href = '/game';
	} catch (e) {
		console.log(e);
		alert(`${e.status}: ${e.response}`);
	}
}

// Función para enviar los datos de inicio de sesión
async function putLogin(data) {
	try {
		const token = await makeRequest(
			'POST',
			'/auth/login',
			{ 'Content-Type': 'application/json' },
			data,
		);
		localStorage.setItem('token', token);
		window.location.href = '/game';
	} catch (e) {
		console.log(e);
		alert(`${e.status}: ${e.response}`);
	}
}

// Función para inicializar los datos del usuario
async function initData() {
	try {
		let user = await makeRequest('GET', '/user', {
			'Content-Type': 'application/json',
			'x-auth-user': localStorage.token,
		});
		user = JSON.parse(user);
		document.getElementById('username').innerHTML =
			`Username: ${user.username}`;
		document.getElementById('email').innerHTML = `Email: ${user.email}`;
		if (user.bests.length === 0) {
			document.getElementById('best').innerHTML = 'Best: 0';
		} else {
			document.getElementById('best').innerHTML =
				`Best: ${user.bests[0].score}`;
		}
		newGame();
		return best;
	} catch (e) {
		console.log(e);
		alert(`${e.status}: ${e.response}`);
	}
}

// Función para editar los datos del usuario
async function editUser() {
	try {
		const body = {};
		if (
			document.getElementById('updateEmail').value === '' &&
			document.getElementById('updateUsername').value === '' &&
			document.getElementById('oldPassword').value === '' &&
			document.getElementById('updatePassword').value === '' &&
			document.getElementById('passwordConfirm').value === ''
		)
			return;
		if (document.getElementById('updateEmail').value !== '') {
			body.email = document.getElementById('updateEmail').value;
		}
		if (
			document.getElementById('updateUsername').value !== '' &&
			document.getElementById('username').innerHTML.substring(10) !==
				document.getElementById('updateUsername').value
		) {
			body.username = document.getElementById('updateUsername').value;
		}
		if (document.getElementById('updatePassword').value !== '') {
			if (document.getElementById('oldPassword').value === '') {
				alert(
					'In order to change your password you have to type your actual password',
				);
				return;
			}
			if (
				document.getElementById('passwordConfirm').value ===
				document.getElementById('updatePassword').value
			) {
				body.password = document.getElementById('updatePassword').value;
				body.oldPassword = document.getElementById('oldPassword').value;
			} else {
				alert('Passwords do not match...');
				return;
			}
		}
		if (
			document.getElementById('oldPassword').value !== '' &&
			document.getElementById('updatePassword').value === ''
		) {
			alert('In order to change your password you have to type a new password');
			return;
		}
		if (
			document.getElementById('passwordConfirm').value !== '' &&
			document.getElementById('updatePassword').value === ''
		) {
			alert('In order to change your password you have to type a new password');
			return;
		}

		const editedUser = await makeRequest(
			'PUT',
			'/user',
			{ 'Content-Type': 'application/json', 'x-auth-user': localStorage.token },
			body,
		);

		const user = JSON.parse(editedUser);
		alert('Changes in profile saved correctly');
		document.getElementById('username').innerHTML =
			`Username: ${user.username}`;
		document.getElementById('email').innerHTML = `Email: ${user.email}`;
		$('#modalEdit').modal('hide');
	} catch (e) {
		console.log(e);
		alert(`${e.status}: ${e.response}`);
	}
}

// Función para eliminar el usuario
async function deleteUser() {
	try {
		await makeRequest('DELETE', '/user', {
			'Content-Type': 'application/json',
			'x-auth-user': localStorage.token,
		});
		alert('User deleted');
		logout();
	} catch (e) {
		console.log(e);
		alert(`${e.status}: ${e.response}`);
	}
}

// Función para obtener las mejores puntuaciones
async function bestScores() {
	try {
		let bestScores = await makeRequest('GET', '/user/bestScores', {
			'Content-Type': 'application/json',
			'x-auth-user': localStorage.token,
		});
		bestScores = JSON.parse(bestScores).bests;
		if (bestScores.length === 0) {
			document.getElementById('score1').disabled = true;
			document.getElementById('score2').disabled = true;
			document.getElementById('score3').disabled = true;
			document.getElementById('score4').disabled = true;
			document.getElementById('score5').disabled = true;

			document.getElementById('score1').innerHTML = 'Score: 0';
			document.getElementById('score2').innerHTML = 'Score: 0';
			document.getElementById('score3').innerHTML = 'Score: 0';
			document.getElementById('score4').innerHTML = 'Score: 0';
			document.getElementById('score5').innerHTML = 'Score: 0';
		} else {
			let cnt = 0;
			bestScores.forEach((item, index) => {
				document.getElementById(`score${index + 1}`).innerHTML =
					`Score: ${item.score}`;
				document.getElementById(`score${index + 1}`).disabled = false;
				cnt++;
			});
			for (let i = cnt; i < 5; i++) {
				document.getElementById(`score${i + 1}`).disabled = true;
			}
		}
	} catch (e) {
		console.log(e);
		alert(`${e.status}: ${e.response}`);
	}
}

// Función para cargar los juegos guardados
async function loadGames() {
	try {
		let saves = await makeRequest('GET', '/user/saveGames', {
			'Content-Type': 'application/json',
			'x-auth-user': localStorage.token,
		});
		const children = document.getElementById('loads').children;
		for (let i = children.length - 1; i >= 0; i--) {
			document.getElementById('loads').removeChild(children[i]);
		}
		saves = JSON.parse(saves);
		if (saves.saveBoards == null) return;
		saves.saveBoards.forEach((item, index) => {
			document.getElementById('loads').insertAdjacentHTML(
				'beforeend',
				`<button class="btn btn-primary" style="margin: 2vmin" href="#" saveName="${item.name}" 
                    onclick="loadGame(${index})">${item.name} - score: ${item.score}</button>`,
			);
		});
	} catch (e) {
		console.log(e);
		alert(`${e.status}: ${e.response}`);
	}
}

// Función para obtener el leaderboard
async function leaderBoard() {
	try {
		let bestScores = await makeRequest('GET', '/user/leaders', {
			'Content-Type': 'application/json',
			'x-auth-user': localStorage.token,
		});
		bestScores = JSON.parse(bestScores);
		if (bestScores.length === 0) return;
		bestScores.forEach((item, index) => {
			document.getElementById(`bestUser${index + 1}`).innerHTML = item.username;
			document.getElementById(`bestScore${index + 1}`).innerHTML = item.score;
		});
	} catch (e) {
		console.log(e);
		alert(`${e.status}: ${e.response}`);
	}
}
