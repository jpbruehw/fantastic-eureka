const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
    subscribeStatistics: (callback) =>
        ipcOn('statistics', (stats) => {
            callback(stats);
        }),
    subscribeChangeView: (callback) =>
        ipcOn('changeView', (view) => {
            callback(view);
        }),
    getStaticData: () => ipcInvoke('getStaticData'),
    sendFrameAction: (payload) => ipcSend('sendFrameAction', payload),
} satisfies Window['electron']);

// This ipcRenderer is an async function so we need to return a promise
function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key
): Promise<EventPayloadMapping[Key]> {
    logEvent('invoke', key as string);
    return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    logEvent('on', key as string);
    const cb = (_: Electron.IpcRendererEvent, payload: any) => {
        logEvent('receive', key as string, payload);
        callback(payload);
    };
    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    payload: EventPayloadMapping[Key]
) {
    logEvent('send', key as string, payload);
    electron.ipcRenderer.send(key, payload);
}

function logEvent(type: string, event: string, payload?: any) {
    const timestamp = new Date().toISOString();
    console.log(`[IPC ${type.toUpperCase()}] ${timestamp} - ${event}`, payload || '');
}