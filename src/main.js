const { app, BrowserWindow, session, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const FingerprintGenerator = require('./fingerprint-generator');
const DataCleaner = require('./data-cleaner');
const FingerprintInjector = require('./fingerprint-injector');

class RandomFingerprintBrowser {
    constructor() {
        this.mainWindow = null;
        this.fingerprintGenerator = new FingerprintGenerator();
        this.dataCleaner = new DataCleaner();
        this.fingerprintInjector = new FingerprintInjector();
        this.isQuitting = false;
    }

    async initialize() {
        // 等待Electron准备就绪
        await app.whenReady();
        
        // 清理上次的数据
        await this.dataCleaner.cleanAllData();
        
        // 生成随机指纹
        const fingerprint = this.fingerprintGenerator.generate();
        
        // 创建浏览器窗口
        await this.createWindow(fingerprint);
        
        // 设置应用事件监听
        this.setupAppEvents();
    }

    async createWindow(fingerprint) {
        // 创建新的session以确保隔离
        const customSession = session.fromPartition(`random-${Date.now()}`);
        
        // 应用指纹设置到session
        await this.applyFingerprint(customSession, fingerprint);
        
        this.mainWindow = new BrowserWindow({
            width: fingerprint.screenWidth || 1920,
            height: fingerprint.screenHeight || 1080,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                session: customSession,
                // 禁用隐私模式相关功能
                partition: `random-${Date.now()}`,
                // 确保每次都是新的环境
                clearCache: true,
                clearStorageData: true
            },
            show: false,
            titleBarStyle: 'default',
            icon: path.join(__dirname, '../assets/icon.png')
        });

        // 窗口准备好后显示
        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow.show();
            console.log('浏览器已启动，指纹已随机化');
        });

        // 注入指纹脚本
        this.mainWindow.webContents.on('dom-ready', () => {
            this.fingerprintInjector.injectToPage(this.mainWindow.webContents, fingerprint);
        });

        // 加载起始页面
        await this.mainWindow.loadURL('https://www.google.com');

        // 设置窗口关闭事件
        this.mainWindow.on('close', async (event) => {
            if (!this.isQuitting) {
                event.preventDefault();
                await this.handleWindowClose();
            }
        });

        // 窗口关闭后清理
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }

    async applyFingerprint(session, fingerprint) {
        // 设置User-Agent
        session.setUserAgent(fingerprint.userAgent);
        
        // 设置其他指纹信息
        await session.webRequest.onBeforeSendHeaders((details, callback) => {
            // 修改请求头
            details.requestHeaders['Accept-Language'] = fingerprint.language;
            details.requestHeaders['Accept-Encoding'] = fingerprint.acceptEncoding;
            
            callback({ requestHeaders: details.requestHeaders });
        });

        // 注入指纹脚本将在窗口创建后处理
    }

    // 这个方法已被FingerprintInjector替代，保留用于兼容性
    injectFingerprintScript(fingerprint) {
        console.log('使用高级指纹注入器...');
        this.fingerprintInjector.injectToPage(this.mainWindow.webContents, fingerprint);
    }

    async handleWindowClose() {
        try {
            // 显示清理进度
            const result = await dialog.showMessageBox(this.mainWindow, {
                type: 'question',
                buttons: ['确定退出', '取消'],
                defaultId: 0,
                message: '退出浏览器',
                detail: '退出后将清除所有浏览数据并重置指纹，确定要退出吗？'
            });

            if (result.response === 0) {
                this.isQuitting = true;
                
                // 清理所有数据
                await this.dataCleaner.cleanAllData();
                
                console.log('所有数据已清理，浏览器即将退出');
                
                // 退出应用
                app.quit();
            }
        } catch (error) {
            console.error('退出时发生错误:', error);
            app.quit();
        }
    }

    setupAppEvents() {
        app.on('window-all-closed', () => {
            // 在macOS上，除非用户明确退出，否则应用会保持活跃状态
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', async () => {
            // 在macOS上，当点击dock图标且没有其他窗口打开时，重新创建窗口
            if (BrowserWindow.getAllWindows().length === 0) {
                const fingerprint = this.fingerprintGenerator.generate();
                await this.createWindow(fingerprint);
            }
        });

        app.on('before-quit', async () => {
            this.isQuitting = true;
            await this.dataCleaner.cleanAllData();
        });
    }
}

// 创建并启动应用
const browser = new RandomFingerprintBrowser();
browser.initialize().catch(console.error);

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (reason) => {
    console.error('未处理的Promise拒绝:', reason);
});
