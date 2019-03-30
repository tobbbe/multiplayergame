const settings = require('./game-settings');

module.exports = {
	players: {},
	tiles: createGameTiles(settings.boardSize)
};

function createGameTiles(size) {
	const rows = [];

	for (let x = 0; x < size; x++) {
		const row = [];

		for (let y = 0; y < size; y++) {
			row.push({ x, y, player: null })
		}

		rows.push(row)
	}

	return rows;
}