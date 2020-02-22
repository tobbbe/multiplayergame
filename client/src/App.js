import React, { useState, useEffect } from 'react';
import './App.css';
import Tile from "./components/Tile";

// eslint-disable-next-line no-unused-vars
let sleeping = false;

// LABYRINTSPEL?!
// HITTA POWER UPS (göra hål i väggar, skjuta osv)

export default function App() {
	// eslint-disable-next-line no-unused-vars
	const [player, setPlayer] = useState();
	const [gameState, setGameState] = useState({ loading: true });

	const init = React.useCallback(async function init() {
		const cachedPlayer = JSON.parse(localStorage.getItem('game-cache') || '{}');
		setPlayer(cachedPlayer)

		const setupResp = await fetch('/setup');
		const setup = await setupResp.json();

		console.log(setup)

		const socket = window.io('http://localhost:' + setup.port, {
			query: cachedPlayer.id ? "playerId=" + cachedPlayer.id : "",
			timeout: 3000,
			transports: ['websocket'] // OBS! kan kommenteras tillbaka om du kör på servern och inte reacts livereload
		});

		socket.on('connect_error', err => handleErrors(err));
		socket.on('connect_failed', err => handleErrors(err));
		socket.on('disconnect', err => handleErrors(err));

		window.addEventListener('keyup', e => {

			// prevent spamming the server
			// if (sleeping) return;
			// sleeping = true;
			// setTimeout(() => {
			// 	sleeping = false;
			// }, Math.floor(gameState.tickLengthMs));

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
			// console.log(data);

			// uncomment to see how long it takes to
			// emit and recieve state:update
			// const time = Date.now();
			// console.log(time - data.sendAt)

			setGameState(data);
		});

		socket.on('player:connected', (data) => {
			console.log('player:connected', data);
			localStorage.setItem('game-cache', JSON.stringify(data));
			setPlayer(data);
		});

		return socket.close;
	}, [])

	useEffect(() => {
		init()
	}, [init])

	function handleErrors(error) {
		console.log(error)
		setGameState({ error });
	}

	if (gameState.loading) return (<span className="loader">loading...</span>);
	if (gameState.error) return (
		<>
			<h2>Something went wrong :(</h2>
			<p>see console for more info</p>
			<pre>{JSON.stringify(gameState.error, null, 1)}</pre>
		</>
	);

	return (
		<div className="app">
			{/* <div style={{ position: 'absolute', right: 0, height: 300, overflow: 'auto' }}>
				<div id="player-name">{player.id}</div>
				<pre id="state">{JSON.stringify(gameState, null, 2)}</pre>
			</div> */}
			{gameState && gameState.tiles &&
				<div className="game-wrapper">
					{gameState.tiles.map((row, ri) => row.map((tile, i) => <Tile key={i} {...tile} />))}
				</div>
			}
		</div>
	);
}
