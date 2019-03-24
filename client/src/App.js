import React, { Component } from 'react';
import './App.css';
import Tile from "./components/Tile";

class App extends Component {

	componentDidMount() {
		// LABYRINTSPEL?!
		// HITTA POWER UPS (göra hål i väggar, skjuta osv)

		const gameStateEl = document.getElementById('state');
		const playerNameEl = document.getElementById('player-name');
		let player = JSON.parse(localStorage.getItem('game-cache') || '{}')
		const socket = window.io(window.location.origin, {
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
	}

	render() {
		return (
			<div className="App">
				<div id="player-name"></div>
				<pre id="state"></pre>
				<div id="game-wrapper">
					{tiles.map((t, i) => <Tile key={i} />)}
				</div>
			</div>
		);
	}
}

export default App;

const tiles = [];
for (let i = 0; i < 3600; i++) {
	tiles.push({})
}

