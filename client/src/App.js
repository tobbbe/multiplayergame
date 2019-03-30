import React, { useState, useEffect } from 'react';
import './App.css';
import Tile from "./components/Tile";

let sleeping = false;

// LABYRINTSPEL?!
// HITTA POWER UPS (göra hål i väggar, skjuta osv)

export default function App() {
	const [gameState, setGameState] = useState({});
	const [player, setPlayer] = useState(JSON.parse(localStorage.getItem('game-cache') || '{}'));

	useEffect(() => {
		const socket = window.io(window.location.origin, {
			query: player.id ? "playerId=" + player.id : "",
		});

		window.addEventListener('keydown', e => {

			// prevent spamming the server
			if (sleeping) return;
			sleeping = true;
			setTimeout(() => {
				sleeping = false;
			}, Math.floor(gameState.tickLengthMs));

			let payload;

			switch (e.keyCode) {
				case 37:
					payload = "LEFT"
					break;

				case 38:
					payload = "UP"
					break;

				case 39:
					payload = "RIGHT"
					break;

				case 40:
					payload = "DOWN"
					break;

				default:
					break;
			}

			if (payload) {
				socket.emit('player:action', { type: 'MOVE', payload })
			}
		});

		socket.on('state:update', (data) => {
			//console.log(data);
			setGameState(data);
		});

		socket.on('player:connected', (data) => {
			console.log('player:connected', data);
			localStorage.setItem('game-cache', JSON.stringify(data));
			setPlayer(data);
		});

		return socket.close;
	}, [])

	return (
		<div className="App">
			{/* <div style={{ position: 'absolute', right: 0, height: 300, overflow: 'auto' }}>
				<div id="player-name">{player.id}</div>
				<pre id="state">{JSON.stringify(gameState, null, 2)}</pre>
			</div> */}
			{gameState && gameState.tiles &&
				<div id="game-wrapper">
					{gameState.tiles.map((row, ri) => row.map((tile, i) => <Tile key={i} {...tile} />))}
				</div>
			}
		</div>
	);
}

