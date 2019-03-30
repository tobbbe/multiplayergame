const gameEngine = require('./game-engine');
const gameState = require('./game-state');
const settings = require('./game-settings');

const step = 1;
const walkCooldown = 3;



function Create({ id, socket, x, y, color }) {
	const player = {
		x: x || 0,
		y: y || 0,
		connected: true,
		color: color || '#111',
		cantMoveUntil: 0,
		id // TODO: remove
	}

	socket.emit('player:connected', { id })
	gameState.tiles[player.y][player.x].player = { ...player };
	gameEngine.queueUpdate();

	socket.on('disconnect', function () {
		player.connected = false;
		console.log('user disconnected');
	});

	socket.on('player:action', function (action) {
		// TODO: prevent client to send (ex hold down) to often

		switch (action.type) {
			case 'MOVE':
				move(player, action.payload)
				break;

			default:
				break;
		}

	});

	return {
		id,
		state: player,
		move
	}
}

function move(player, dir) {

	if (gameEngine.data.ticks < player.cantMoveUntil) {
		return;
	}

	let changed = false;
	const { x: oldX, y: oldY } = player;

	if (dir === "LEFT" && player.x !== 0) {
		const newX = player.x - step;

		if (!gameState.tiles[player.y][newX].player) {
			player.x = newX;
			changed = true;
		}
	}
	else if (dir === "UP" && player.y !== 0) {
		const newY = player.y - step;

		if (!gameState.tiles[newY][player.x].player) {
			player.y = player.y - step;
			changed = true;
		}
	}
	else if (dir === "RIGHT" && player.x < settings.boardSize - 1) {
		const newX = player.x + step;

		if (!gameState.tiles[player.y][newX].player) {
			player.x = player.x + step;
			changed = true;
		}
	}
	else if (dir === "DOWN" && player.y < settings.boardSize - 1) {
		const newY = player.y + step;

		if (!gameState.tiles[newY][player.x].player) {
			player.y = player.y + step;
			changed = true;
		}
	}

	if (changed) {
		gameState.tiles[player.y][player.x].player = { ...player };
		gameState.tiles[oldY][oldX].player = null;

		player.cantMoveUntil = gameEngine.data.ticks + walkCooldown;
		gameEngine.queueUpdate();
	}
}

module.exports.Create = Create;