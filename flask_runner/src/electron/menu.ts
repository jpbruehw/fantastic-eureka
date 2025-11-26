import { app, BrowserWindow, Menu } from "electron";
import { isDev } from "./util.js";

export function createMenu(mainWindow: BrowserWindow) {
	Menu.setApplicationMenu(
		Menu.buildFromTemplate([
			{
				// mac os is weird so we can't define a name as easily
				// this is still not ideal though so think of way to get around this
				label: process.platform === "darwin" ? undefined : "App",
				type: "submenu",
				submenu: [
					{
						label: "Quit",
						click: () => app.quit(),
					},
					{
						label: "DevTools",
						click: () => mainWindow.webContents.openDevTools(),
						visible: isDev(),
					},
					{
						label: "View",
						type: "submenu",
						submenu: [
							{
								label: "CPU",
							},
							{
								label: "RAM",
							},
							{
								label: "STORAGE",
							},
						],
					},
				],
			},
		])
	);
}
