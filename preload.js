const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electron', {
    selectDirectory: async () => {
        return await ipcRenderer.invoke('select-directory');
    },
    getFiles: async dirPath => {
        return await ipcRenderer.invoke('get-files', dirPath);
    },
    renameFiles: async renameOperations => {
        return await ipcRenderer.invoke('rename-files', renameOperations);
    },
});
