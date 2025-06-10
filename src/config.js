const path = require('path');
const os = require('os');

class Config {
    constructor() {
        this.defaultConfig = {
            // 浏览器基础设置
            browser: {
                startUrl: 'https://www.google.com',
                windowWidth: 1920,
                windowHeight: 1080,
                userDataDir: path.join(os.tmpdir(), 'random-browser-' + Date.now()),
                enableDevTools: false,
                enableExtensions: false,
                enablePlugins: false
            },
            
            // 指纹随机化设置
            fingerprint: {
                randomizeUserAgent: true,
                randomizeScreen: true,
                randomizeWebGL: true,
                randomizeCanvas: true,
                randomizeAudio: true,
                randomizeTimezone: true,
                randomizeFonts: true,
                randomizePlugins: true,
                randomizeNetwork: true,
                randomizeBattery: true
            },
            
            // 数据清理设置
            dataCleaning: {
                clearOnExit: true,
                clearCookies: true,
                clearCache: true,
                clearHistory: true,
                clearLocalStorage: true,
                clearSessionStorage: true,
                clearIndexedDB: true,
                clearWebSQL: true,
                clearServiceWorkers: true,
                clearExtensionData: true
            },
            
            // 安全设置
            security: {
                disableWebSecurity: false,
                disableFeatures: [
                    'VizDisplayCompositor',
                    'BackgroundTimerThrottling',
                    'RendererCodeIntegrity',
                    'BlinkGenPropertyTrees'
                ],
                enableSandbox: true,
                disableGpu: false,
                disableDevShm: true
            },
            
            // 网络设置
            network: {
                userAgent: null, // 将由指纹生成器设置
                acceptLanguage: 'en-US,en;q=0.9',
                dnt: '1', // Do Not Track
                proxyServer: null,
                proxyBypassList: null
            },
            
            // 调试设置
            debug: {
                enableLogging: true,
                logLevel: 'info', // error, warn, info, debug
                logToFile: false,
                logFilePath: path.join(__dirname, '../logs/browser.log')
            }
        };
        
        this.currentConfig = { ...this.defaultConfig };
    }

    // 获取配置值
    get(keyPath) {
        const keys = keyPath.split('.');
        let value = this.currentConfig;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        
        return value;
    }

    // 设置配置值
    set(keyPath, value) {
        const keys = keyPath.split('.');
        let target = this.currentConfig;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in target) || typeof target[key] !== 'object') {
                target[key] = {};
            }
            target = target[key];
        }
        
        target[keys[keys.length - 1]] = value;
    }

    // 重置为默认配置
    reset() {
        this.currentConfig = JSON.parse(JSON.stringify(this.defaultConfig));
    }

    // 合并配置
    merge(config) {
        this.currentConfig = this.deepMerge(this.currentConfig, config);
    }

    // 深度合并对象
    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    // 获取Chromium启动参数
    getChromiumArgs() {
        const args = [
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-default-apps',
            '--disable-popup-blocking',
            '--disable-translate',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-ipc-flooding-protection',
            '--disable-hang-monitor',
            '--disable-client-side-phishing-detection',
            '--disable-component-update',
            '--disable-domain-reliability',
            '--disable-features=TranslateUI,BlinkGenPropertyTrees',
            '--disable-background-networking',
            '--disable-sync',
            '--metrics-recording-only',
            '--no-report-upload',
            '--disable-dev-shm-usage'
        ];

        // 安全相关参数
        if (this.get('security.disableWebSecurity')) {
            args.push('--disable-web-security');
            args.push('--disable-features=VizDisplayCompositor');
        }

        if (this.get('security.disableGpu')) {
            args.push('--disable-gpu');
        }

        if (!this.get('security.enableSandbox')) {
            args.push('--no-sandbox');
        }

        // 禁用功能
        const disableFeatures = this.get('security.disableFeatures');
        if (disableFeatures && disableFeatures.length > 0) {
            args.push(`--disable-features=${disableFeatures.join(',')}`);
        }

        // 代理设置
        const proxyServer = this.get('network.proxyServer');
        if (proxyServer) {
            args.push(`--proxy-server=${proxyServer}`);
            
            const proxyBypass = this.get('network.proxyBypassList');
            if (proxyBypass) {
                args.push(`--proxy-bypass-list=${proxyBypass}`);
            }
        }

        // 用户数据目录
        const userDataDir = this.get('browser.userDataDir');
        if (userDataDir) {
            args.push(`--user-data-dir=${userDataDir}`);
        }

        return args;
    }

    // 获取窗口选项
    getWindowOptions() {
        return {
            width: this.get('browser.windowWidth'),
            height: this.get('browser.windowHeight'),
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                webSecurity: !this.get('security.disableWebSecurity'),
                allowRunningInsecureContent: false,
                experimentalFeatures: false
            },
            show: false,
            titleBarStyle: 'default'
        };
    }

    // 验证配置
    validate() {
        const errors = [];

        // 验证窗口尺寸
        const width = this.get('browser.windowWidth');
        const height = this.get('browser.windowHeight');
        
        if (!width || width < 800 || width > 4000) {
            errors.push('窗口宽度必须在800-4000之间');
        }
        
        if (!height || height < 600 || height > 3000) {
            errors.push('窗口高度必须在600-3000之间');
        }

        // 验证URL
        const startUrl = this.get('browser.startUrl');
        if (startUrl && !this.isValidUrl(startUrl)) {
            errors.push('起始URL格式无效');
        }

        // 验证日志级别
        const logLevel = this.get('debug.logLevel');
        const validLogLevels = ['error', 'warn', 'info', 'debug'];
        if (!validLogLevels.includes(logLevel)) {
            errors.push('日志级别必须是: ' + validLogLevels.join(', '));
        }

        return errors;
    }

    // 验证URL格式
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // 导出配置为JSON
    toJSON() {
        return JSON.stringify(this.currentConfig, null, 2);
    }

    // 从JSON导入配置
    fromJSON(jsonString) {
        try {
            const config = JSON.parse(jsonString);
            this.merge(config);
            return true;
        } catch (error) {
            console.error('配置JSON解析失败:', error);
            return false;
        }
    }

    // 获取当前配置的摘要
    getSummary() {
        return {
            fingerprint: {
                enabled: Object.values(this.get('fingerprint')).some(v => v === true),
                features: Object.keys(this.get('fingerprint')).filter(k => this.get(`fingerprint.${k}`))
            },
            dataCleaning: {
                enabled: this.get('dataCleaning.clearOnExit'),
                features: Object.keys(this.get('dataCleaning')).filter(k => this.get(`dataCleaning.${k}`))
            },
            security: {
                sandboxEnabled: this.get('security.enableSandbox'),
                webSecurityEnabled: !this.get('security.disableWebSecurity')
            }
        };
    }
}

module.exports = Config;
