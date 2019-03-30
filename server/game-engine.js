let _needsUpdate = false;

let config = null;
let hasStarted = false;

const TICK_RATE = 30;
let previous = hrtimeMs();
let tickLengthMs = 1000 / TICK_RATE;
const data = {
	ticks: 0
}

function hrtimeMs() {
	let time = process.hrtime();
	return time[0] * 1000 + time[1] / 1000000;
}

const loop = () => {
	setTimeout(loop, tickLengthMs);
	let now = hrtimeMs();
	let delta = (now - previous) / 1000;

	if (_needsUpdate) {
		config.update(delta);
		_needsUpdate = false;
	}

	data.ticks++;
	previous = now;
}

function init(_config) {
	if (!hasStarted) {
		config = _config;
		config.update();
		loop()
		hasStarted = true;
	}
	else {
		console.log("GAME LOOP ALREADY RUNNING")
	}
}

function queueUpdate() {
	_needsUpdate = true;
}

module.exports = {
	init,
	queueUpdate,
	data,
	tickLengthMs
}