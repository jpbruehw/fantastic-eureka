import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";
import { getAssetPath } from "./pathResolver.js";

export function createTray(mainWindow: BrowserWindow) {
	const tray = new Tray(
		path.join(
			getAssetPath(),
			process.platform == "darwin"
				? "trayIconTemplate.png"
				: "trayIcon.png"
		)
	);
	// https://www.electronjs.org/docs/latest/tutorial/tray
	tray.setToolTip("Monitor Buddy");
	tray.setContextMenu(
		Menu.buildFromTemplate([
			{
				label: "Show",
				click: () => {
					mainWindow.show();
					// for mac users need to show this
					if (app.dock) {
						app.dock.show();
					}
				},
			},
			{
				label: "Quit",
				click: () => app.quit(),
			},
		])
	);
}
