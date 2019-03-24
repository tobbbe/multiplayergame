// LABYRINTSPEL?!
// HITTA POWER UPS (göra hål i väggar, skjuta osv)

const gameCanvasEl = document.getElementById('game-canvas');
const gameStateEl = document.getElementById('state');
const playerNameEl = document.getElementById('player-name');
let player = JSON.parse(localStorage.getItem('game-cache') || '{}')
const socket = io(window.location.origin, {
	query: player.playerId ? "playerId=" + player.playerId : "",
});

// TODO: prevent holding key down? + serverside
window.addEventListener('keydown', e => {
	socket.emit('player:action', { type: 'MOVE', payload: e.keyCode })
});

socket.on('state:update', (data) => {
	gameStateEl.innerHTML = JSON.stringify(data, null, 2);
});

socket.on('player:connected', (data) => {
	console.log('player:connected', data);
	player = data;
	playerNameEl.innerHTML = data.playerId;
	localStorage.setItem('game-cache', JSON.stringify(data));
});