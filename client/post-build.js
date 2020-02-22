var rimraf = require('rimraf');
var copydir = require('copy-dir');

const serverBuildFolder = './../server/build'

// remove existing files
rimraf(serverBuildFolder, err => {
	if (err) return console.log(err);

	console.log('old files removed')

	// copy files to website
	copydir.sync('./build', serverBuildFolder, (stat, filepath, filename) => {
		return true;
	});

	console.log('new files copied')
})