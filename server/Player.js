const gameEngine = require('./game-engine');

const speed = 1;

function Create(id, socket) {
	const state = {
		x: 0,
		y: 0,
		connected: true
	}

	socket.emit('player:connected', { playerId: id })
	gameEngine.queueUpdate();

	socket.on('disconnect', function () {
		state.connected = false;
		console.log('user disconnected');
	});

	socket.on('player:action', function (action) {
		console.log(action);

		switch (action.type) {
			case 'MOVE':
				move(action.payload, state)
				break;

			default:
				break;
		}

	});

	return {
		id,
		state,
		move
	}
}

function move(dir, state) {

	// TODO: set cantMoveUntilTics: currentTick + xx??

	if (dir === 37) {
		state.x = state.x - speed;
	}
	else if (dir === 38) {
		state.y = state.y - speed;
	}
	else if (dir === 39) {
		state.x = state.x + speed;
	}
	else if (dir === 40) {
		state.y = state.y + speed;
	}
	gameEngine.queueUpdate();
}

module.exports.Create = Create;