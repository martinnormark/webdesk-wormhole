'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
const http = require('http');
const fs = require('fs');
const path = require('path');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

const server = http.createServer(function (req, res) {
	var filePath = '/Users/martinnormark/Documents/Høst API notes.txt';
	var stat = fs.statSync(filePath);

	res.writeHead(200, {
			'Content-Type': 'text/plain',
			'Content-Disposition': 'attachment; filename="' + path.basename(filePath) + '"',
			'Content-Length': stat.size
	});

	var readStream = fs.createReadStream(filePath);

	readStream.pipe(res);
});

function createMainWindow () {
	const win = new BrowserWindow({
		width: 600,
		height: 400,
		resizable: false
	});

	win.loadUrl(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

function onClosed() {
	// deref the window
	// for multiple windows store them in an array
	mainWindow = null;
}

// prevent window being GC'd
let mainWindow;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate-with-no-open-windows', function () {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', function () {
	mainWindow = createMainWindow();

	server.listen(1337, '127.0.0.1');
});
