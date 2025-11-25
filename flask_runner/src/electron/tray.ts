import { BrowserWindow, Tray } from "electron";
import path from "path";
import { getAssetPath } from "./pathResolver.js";

export function createTray(mainWindow: BrowserWindow) {
	new Tray(
		path.join(
			getAssetPath(),
			process.platform == "darwin"
				? "trayIconTemplate.png"
				: "trayIcon.png"
		)
	);
}
