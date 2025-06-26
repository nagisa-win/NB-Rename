const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// 设置开发环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // 在开发环境中加载webpack-dev-server提供的URL
    // 在生产环境中加载打包后的HTML文件
    const startUrl =
        process.env.NODE_ENV === 'development'
            ? `file://${path.join(__dirname, 'dist', 'index.html')}`
            : `file://${path.join(__dirname, 'dist', 'index.html')}`;

    console.log('Loading URL:', startUrl);
    console.log('Current directory:', __dirname);
    console.log(
        'HTML file exists:',
        fs.existsSync(path.join(__dirname, 'dist', 'index.html'))
    );

    mainWindow.loadURL(startUrl);

    // 在开发环境中打开开发者工具
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// 处理选择文件夹的请求
ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
    });
    return result.filePaths;
});

// 获取文件夹中的文件
ipcMain.handle('get-files', async (event, dirPath) => {
    try {
        const files = fs.readdirSync(dirPath);
        const fileDetails = files.map(file => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            return {
                name: file,
                path: filePath,
                isDirectory: stats.isDirectory(),
                size: stats.size,
                lastModified: stats.mtime.toISOString(),
            };
        });
        return fileDetails;
    } catch (error) {
        console.error('Error reading directory:', error);
        return {error: error.message};
    }
});

// 执行重命名操作
ipcMain.handle('rename-files', async (event, renameOperations) => {
    const results = [];

    for (const op of renameOperations) {
        try {
            const dirPath = path.dirname(op.oldPath);
            const newPath = path.join(dirPath, op.newName);

            fs.renameSync(op.oldPath, newPath);

            results.push({
                success: true,
                oldPath: op.oldPath,
                newPath: newPath,
            });
        } catch (error) {
            results.push({
                success: false,
                oldPath: op.oldPath,
                error: error.message,
            });
        }
    }

    return results;
});
