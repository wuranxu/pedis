const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
// const Log = require("electron-log");
const path = require("path");
// const ipcEvent = require("./modules/ipcEvent");
let mainWindow;

/**
 *创建主进程窗口
 *
 */
function createWindow() {
    // 添加log
    let userDataDir = app.getPath("userData");
    // Log.transports.file.file = userDataDir + "/logs/info.log";
    // 只允许启动一个进程
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
        app.quit();
    } else {
        app.on("second-instance", (event, commandLine, workingDirectory) => {
            // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
            if (mainWindow) {
                if (mainWindow.isMinimized()) {
                    mainWindow.restore();
                }
                mainWindow.focus();
                mainWindow.once("ready-to-show", () => {
                    mainWindow.show();
                });
            }
        });
    }
    // 添加开发插件
    if (!app.isPackaged) {
        // dev
        // const {
        //     default: installExtension,
        //     REACT_DEVELOPER_TOOLS,
        // } = require("electron-devtools-installer");
        // app.whenReady().then(() => {
        //     installExtension(REACT_DEVELOPER_TOOLS)
        //         .then((name) => console.log(`Added Extension:  ${name}`))
        //         .catch((err) => console.log("An error occurred: ", err));
        // });
    }
    // 创建BrowserWindow
    let openDevTools = true;
    if (app.isPackaged) {
        // 生产环境，不开启devtools
        openDevTools = true;
    }
    mainWindow = new BrowserWindow({
        show: false,
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "./preload.js"),
            devTools: openDevTools,
            enableRemoteModule: true,
            contextIsolation: false,
        },
        backgroundColor: "#EBEBEB",
    });

    Menu.setApplicationMenu(null);
    // 初始化事件
    // ipcEvent.init(mainWindow);
    // 最大化
    // mainWindow.maximize();
    // mainWindow.loadFile(path.join(__dirname, './dist/index.html'))
    // mainWindow.webContents.openDevTools();

    if (!app.isPackaged) {
        // mainWindow.loadFile(path.join(__dirname, './dist/index.html'))
        // 非打包状态，表示开发环境
        mainWindow.loadURL("http://localhost:5173/");
        // // Open the DevTools.
        mainWindow.webContents.openDevTools();
    } else {
        // 打包状态，表示生产环境
        mainWindow.loadFile(path.join(__dirname, './dist/index.html'))
    }
    // 关闭窗口
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
    // 在加载页面时，渲染进程第一次完成绘制时，如果窗口还没有被显示，渲染进程会发出 ready-to-show 事件 。 在此事件后显示窗口将没有视觉闪烁
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });

    // 吃掉当用户点击鼠标返回按钮
    mainWindow.on("app-command", (e, cmd) => {
        if (cmd === "browser-backward" && mainWindow.webContents.canGoBack()) {
            // 啥事都不干
        }
    });
    // 崩溃处理
    mainWindow.webContents.on("crashed", () => {
        const options = {
            type: "info",
            title: "渲染器进程崩溃",
            message: "这个进程已经崩溃.",
            buttons: ["重载", "关闭"],
        };
        dialog.showMessageBox(options, (index) => {
            if (index === 0) {
                mainWindow.reload();
            } else {
                mainWindow.close();
            }
        });
    });
}

app.allowRendererProcessReuse = false;

app.whenReady().then(() => {
    createWindow()
    ipcMain.handle('get-file-path', async (event, ...args) => {
        // event.sender.send("send-path", app.getPath("userData"))
        return app.getPath("userData");
    })
});

//关闭程序
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) createWindow();
});

// GPU进程崩溃
app.on("gpu-process-crashed", function () {
    Log.error("[cmd=main] gpu-process-crashed");
    app.exit(0);
});

