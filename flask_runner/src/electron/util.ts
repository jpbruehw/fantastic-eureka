import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";

export function isDev(): boolean {
	return process.env.NODE_ENV === "development";
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
	key: Key,
	handler: () => EventPayloadMapping[Key]
) {
	ipcMain.handle(key, (event) => {
		validateEventFrame(event.senderFrame);
		return handler();
	});
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(
	key: Key,
	handler: (payload: EventPayloadMapping[Key]) => void
) {
	ipcMain.on(key, (event, payload) => {
		validateEventFrame(event.senderFrame);
		return handler(payload);
	});
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
	key: Key,
	webContents: WebContents,
	payload: EventPayloadMapping[Key]
) {
	webContents.send(key, payload);
}

/** This part was edited by the Kilo code editor
 *  Not sure what it did but it seemed to work, need to look at this more
 */

// look into this more this can get very complicated fast
// we are going to need this
export function validateEventFrame(frame: WebFrameMain | null): void {
	// If frame is null, the event was not sent from a web context
	// This could be from native menus, system tray, or other native sources
	// For security, we should reject events that don't come from our expected web frame
	if (!frame) {
		throw new Error("Event must be sent from a valid web frame");
	}

	if (isDev() && new URL(frame.url).host === "localhost:5123") {
		return;
	}

	// https://www.geeksforgeeks.org/node-js/node-js-url-pathtofileurl-api/
	if (frame.url !== pathToFileURL(getUIPath()).toString()) {
		throw new Error("Malicious event");
	}
}
