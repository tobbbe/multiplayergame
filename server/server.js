const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuidV4 = require('uuid/v4');
const Player = require('./Player');
const gameEngine = require('./game-engine');

let pause = false;
let gameState = {
	players: {},
	sceen: {
		width: 60,
		height: 60
	}
};

app.use('/static', express.static(path.join(__dirname, '../client')))

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	let id = socket.handshake.query.playerId || uuidV4();
	console.log('a user connected', id);
	gameState.players[id] = Player.Create(id, socket);
});

http.listen(5000, function () {
	console.log('listening on *:5000');
});

function gameUpdate(delta) {
	//console.log('delta', delta)
	io.emit('state:update', gameStateFormatted())
	gameState._needsUpdate = false;
}

gameEngine.init({
	update: gameUpdate
})

function gameStateFormatted() {
	return {
		players: Object.keys(gameState.players).map(id => gameState.players[id].state)
	}
}
