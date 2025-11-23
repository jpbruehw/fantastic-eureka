import { app, BrowserWindow, ipcMain, Tray } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getStaticData, pollResource } from "./resourceManager.js";
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js";

//type test = string;

app.on("ready", () => {
	const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: getPreloadPath(),
		},
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
	new Tray(
		path.join(
			getAssetPath(),
			process.platform == "darwin"
				? "trayIconTemplate.png"
				: "trayIcon.png"
		)
	);
});

/** */
function handleCloseEvents(mainWindow: BrowserWindow) {
	let willClose = false;

	if (willClose) {
		return;
	}
	mainWindow.on("close", (e) => {
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
