import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getStaticData, pollResource } from "./resourceManager.js";
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";

/**
 * If you want to disable the menu completely you can do so with this line here
 * this is mainly relevant for mac but still good to know
 * In most cases, you would want some stuff here
 */
//Menu.setApplicationMenu(null);

/**
 * This type of function is present in basically every electron app
 * it ensures that all the things on startup actually render properly
 *
 */
app.on("ready", () => {
	const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: getPreloadPath(),
		},
		// this too is mainly relevant for mac look into this more
		frame: false,
	});
	if (isDev()) {
		mainWindow.loadURL("http://localhost:5123");
	} else {
		mainWindow.loadFile(getUIPath());
	}

	pollResource(mainWindow);

	ipcMain.handle("getStatisticData", () => {
		return getStaticData();
	});

	// this is the system tray, very useful look into this more
	// also how to keep this going when window is closed but not the application on macOS
	// https://www.electronjs.org/docs/latest/api/tray#new-trayimage-guid
	// for macOS, you need to use only black and white and the way to differentiate
	// is with this process.platform thing and for whatever reason darwin means macOS
	createTray(mainWindow);

	createMenu(mainWindow);

	handleCloseEvents(mainWindow);
});

/**
 * Look more into how this actually works
 * might need to look into how this works more
 * Overrides the window's normal close behavior
 * Event listeners fire every time the even happens,
 * even though the function is only called once
 *
 */
function handleCloseEvents(mainWindow: BrowserWindow) {
	let willClose = false;

	mainWindow.on("close", (e) => {
		if (willClose) {
			return;
		}
		e.preventDefault();
		mainWindow.hide();
		// this part is specifically for macOS
		// without this, it wouldn't remove the icon properly
		if (app.dock) {
			app.dock.hide();
		}
	});

	app.on("before-quit", () => {
		willClose = true;
	});

	mainWindow.on("show", () => {
		willClose = false;
	});
}
