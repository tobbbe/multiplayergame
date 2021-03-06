const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuidV4 = require('uuid/v4');
const Player = require('./Player');
const gameEngine = require('./game-engine');
const { dev, port } = require('./game-settings');
const gameState = require('./game-state');

console.log(dev ? 'running DEV' : 'running PROD')

app.use('/static', express.static(path.join(__dirname, (dev ? '../client' : '/build/static'))))

app.get('/', function (req, res) {
	res.sendFile(__dirname + (dev ? '/index.html' : '/build/index.html'));
});

app.get('/setup', function (req, res) {
	res.send({ port });
});

io.on('connection', function (socket) {
	let id = socket.handshake.query.playerId || uuidV4();
	console.log('a user connected', id);
	gameState.players[id] = Player.Create({ ...(gameState.players[id] ? gameState.players[id].state : {}), id, socket });
});

http.listen(port, function () {
	console.log('listening on *:' + port);
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
		players: Object.keys(gameState.players).map(id => gameState.players[id].state),
		tiles: gameState.tiles,
		tickLengthMs: gameEngine.tickLengthMs,
		sendAt: Date.now()
	}
}

