import { ipcMain, WebContents, WebFrameMain } from 'electron';
import { getUIPath } from './pathResolver.js';
import { pathToFileURL } from 'url';

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
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

// look into this more this can get very complicated fast
// we are going to need this 
export function validateEventFrame(frame: WebFrameMain) {
    if (isDev() && new URL(frame.url).host === 'localhost:5123') {
        return;
    }
    // https://www.geeksforgeeks.org/node-js/node-js-url-pathtofileurl-api/
    if (frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error('Malicious event');
    }
}