import React, { useEffect, useState } from 'react';
import './Tile.css'

const Tile = React.memo(function Tile({ player }) {
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
})

export default Tile;