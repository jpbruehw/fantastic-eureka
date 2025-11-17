import { ipcMain, WebContents } from "electron"

export function isDev(): boolean {
    return process.env.NODE_ENV == 'development'
}

// payload mapping function
// ipc main is not type safe automatically but using this wrapper we can make them
function ipcHandle<Key extends keyof EventPayloadMapping>(key: Key, handler: () => EventPayloadMapping[Key]) {
    ipcMain.handle(key, () => handler())
}

/**
 * WebContents represents the data inside of the browser eindow
 * this loads and renders the js/html
 */
export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
) {
    webContents.send(key, payload);
}