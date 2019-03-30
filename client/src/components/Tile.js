import React, { useEffect, useState } from 'react';
import './Tile.css'

export default function Tile({ player }) {
	const [classNames, setClass] = useState('tile');

	useEffect(() => {
		if (player) {
			setClass("tile player-tile")
		}
		else {
			setClass("tile")
			// setTimeout(() => {
			// 	setClass("tile")
			// }, 300);
		}

	}, [player])

	return (
		<div className={classNames}></div>
	);
}