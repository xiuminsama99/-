# 随机指纹浏览器 - API参考文档

## 📋 目录

1. [FingerprintGenerator API](#fingerprintgenerator-api)
2. [FingerprintInjector API](#fingerprintinjector-api)
3. [DataCleaner API](#datacleaner-api)
4. [Config API](#config-api)
5. [RandomFingerprintBrowser API](#randomfingerprintbrowser-api)
6. [数据结构定义](#数据结构定义)
7. [错误处理](#错误处理)
8. [事件系统](#事件系统)

## 🎭 FingerprintGenerator API

### 类: FingerprintGenerator

浏览器指纹生成器，负责创建随机化的浏览器指纹信息。

#### 构造函数

```javascript
new FingerprintGenerator()
```

创建一个新的指纹生成器实例。

**示例:**
```javascript
const generator = new FingerprintGenerator();
```

#### 方法

##### generate()

生成一个完整的随机浏览器指纹。

```javascript
generate(): Fingerprint
```

**返回值:**
- `Fingerprint` - 包含所有指纹信息的对象

**示例:**
```javascript
const fingerprint = generator.generate();
console.log(fingerprint.userAgent); // "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
```

##### generateMobileFingerprint()

生成移动设备专用的指纹。

```javascript
generateMobileFingerprint(): MobileFingerprint
```

**返回值:**
- `MobileFingerprint` - 移动设备指纹对象

**示例:**
```javascript
const mobileFingerprint = generator.generateMobileFingerprint();
console.log(mobileFingerprint.platform); // "iPhone"
```

##### generateTabletFingerprint()

生成平板设备专用的指纹。

```javascript
generateTabletFingerprint(): TabletFingerprint
```

**返回值:**
- `TabletFingerprint` - 平板设备指纹对象

##### getRandomElement(array)

从数组中随机选择一个元素。

```javascript
getRandomElement(array: Array<any>): any
```

**参数:**
- `array` - 要选择的数组

**返回值:**
- 数组中的随机元素

**示例:**
```javascript
const platforms = ['Win32', 'MacIntel', 'Linux x86_64'];
const randomPlatform = generator.getRandomElement(platforms);
```

##### getRandomInt(min, max)

生成指定范围内的随机整数。

```javascript
getRandomInt(min: number, max: number): number
```

**参数:**
- `min` - 最小值（包含）
- `max` - 最大值（包含）

**返回值:**
- 范围内的随机整数

## 💉 FingerprintInjector API

### 类: FingerprintInjector

指纹注入器，负责将生成的指纹注入到浏览器环境中。

#### 构造函数

```javascript
new FingerprintInjector()
```

#### 方法

##### generateInjectionScript(fingerprint)

生成完整的指纹注入脚本。

```javascript
generateInjectionScript(fingerprint: Fingerprint): string
```

**参数:**
- `fingerprint` - 要注入的指纹对象

**返回值:**
- `string` - 可执行的JavaScript代码

**示例:**
```javascript
const script = injector.generateInjectionScript(fingerprint);
webContents.executeJavaScript(script);
```

##### injectToPage(webContents, fingerprint)

将指纹注入到指定的页面中。

```javascript
injectToPage(webContents: WebContents, fingerprint: Fingerprint): void
```

**参数:**
- `webContents` - Electron的WebContents对象
- `fingerprint` - 要注入的指纹对象

**示例:**
```javascript
injector.injectToPage(mainWindow.webContents, fingerprint);
```

##### isInjected(webContentsId)

检查指定页面是否已注入指纹。

```javascript
isInjected(webContentsId: number): boolean
```

**参数:**
- `webContentsId` - WebContents的ID

**返回值:**
- `boolean` - 是否已注入

##### cleanup(webContentsId)

清理指定页面的注入记录。

```javascript
cleanup(webContentsId: number): void
```

**参数:**
- `webContentsId` - WebContents的ID

## 🧹 DataCleaner API

### 类: DataCleaner

数据清理器，负责清除浏览器的所有数据和设置。

#### 构造函数

```javascript
new DataCleaner()
```

#### 方法

##### cleanAllData()

清理所有浏览器数据。

```javascript
cleanAllData(): Promise<void>
```

**返回值:**
- `Promise<void>` - 清理完成的Promise

**示例:**
```javascript
await cleaner.cleanAllData();
console.log('所有数据已清理');
```

##### cleanSessionData()

清理Session相关数据。

```javascript
cleanSessionData(): Promise<void>
```

**返回值:**
- `Promise<void>` - 清理完成的Promise

##### cleanFileSystemData()

清理文件系统中的数据。

```javascript
cleanFileSystemData(): Promise<void>
```

##### cleanCache()

清理各种缓存数据。

```javascript
cleanCache(): Promise<void>
```

##### resetSettings()

重置浏览器设置到默认状态。

```javascript
resetSettings(): Promise<void>
```

##### getDataUsageStats()

获取数据使用统计信息。

```javascript
getDataUsageStats(): Promise<DataStats>
```

**返回值:**
- `Promise<DataStats>` - 数据统计对象

**示例:**
```javascript
const stats = await cleaner.getDataUsageStats();
console.log(`总大小: ${cleaner.formatFileSize(stats.totalSize)}`);
```

##### formatFileSize(bytes)

格式化文件大小显示。

```javascript
formatFileSize(bytes: number): string
```

**参数:**
- `bytes` - 字节数

**返回值:**
- `string` - 格式化的大小字符串

**示例:**
```javascript
const formatted = cleaner.formatFileSize(1024); // "1.00 KB"
```

## ⚙️ Config API

### 类: Config

配置管理器，负责应用的配置管理。

#### 构造函数

```javascript
new Config()
```

#### 方法

##### get(keyPath)

获取配置值。

```javascript
get(keyPath: string): any
```

**参数:**
- `keyPath` - 配置键路径，使用点号分隔

**返回值:**
- 配置值

**示例:**
```javascript
const width = config.get('browser.windowWidth');
const enableFingerprint = config.get('fingerprint.randomizeUserAgent');
```

##### set(keyPath, value)

设置配置值。

```javascript
set(keyPath: string, value: any): void
```

**参数:**
- `keyPath` - 配置键路径
- `value` - 要设置的值

**示例:**
```javascript
config.set('browser.windowWidth', 1920);
config.set('fingerprint.randomizeUserAgent', true);
```

##### reset()

重置为默认配置。

```javascript
reset(): void
```

##### merge(config)

合并配置对象。

```javascript
merge(config: object): void
```

**参数:**
- `config` - 要合并的配置对象

##### validate()

验证当前配置。

```javascript
validate(): string[]
```

**返回值:**
- `string[]` - 验证错误信息数组

**示例:**
```javascript
const errors = config.validate();
if (errors.length > 0) {
    console.error('配置错误:', errors);
}
```

##### getChromiumArgs()

获取Chromium启动参数。

```javascript
getChromiumArgs(): string[]
```

**返回值:**
- `string[]` - 启动参数数组

##### getWindowOptions()

获取窗口配置选项。

```javascript
getWindowOptions(): BrowserWindowOptions
```

**返回值:**
- `BrowserWindowOptions` - Electron窗口选项

## 🌐 RandomFingerprintBrowser API

### 类: RandomFingerprintBrowser

主控制器类，管理整个应用的生命周期。

#### 构造函数

```javascript
new RandomFingerprintBrowser()
```

#### 方法

##### initialize()

初始化应用。

```javascript
initialize(): Promise<void>
```

**返回值:**
- `Promise<void>` - 初始化完成的Promise

**示例:**
```javascript
const browser = new RandomFingerprintBrowser();
await browser.initialize();
```

##### createWindow(fingerprint)

创建浏览器窗口。

```javascript
createWindow(fingerprint: Fingerprint): Promise<void>
```

**参数:**
- `fingerprint` - 要应用的指纹对象

##### applyFingerprint(session, fingerprint)

应用指纹设置到session。

```javascript
applyFingerprint(session: Session, fingerprint: Fingerprint): Promise<void>
```

**参数:**
- `session` - Electron Session对象
- `fingerprint` - 指纹对象

##### handleWindowClose()

处理窗口关闭事件。

```javascript
handleWindowClose(): Promise<void>
```

##### setupAppEvents()

设置应用事件监听。

```javascript
setupAppEvents(): void
```

## 📊 数据结构定义

### Fingerprint

基础指纹对象结构。

```typescript
interface Fingerprint {
    userAgent: string;           // 用户代理字符串
    platform: string;           // 操作系统平台
    language: string;            // 语言设置
    acceptEncoding: string;      // 接受编码
    screenWidth: number;         // 屏幕宽度
    screenHeight: number;        // 屏幕高度
    colorDepth: number;          // 颜色深度
    hardwareConcurrency: number; // CPU核心数
    deviceMemory: number;        // 设备内存
    webglVendor: string;         // WebGL供应商
    webglRenderer: string;       // WebGL渲染器
    timezoneOffset: number;      // 时区偏移
    timestamp: number;           // 生成时间戳
    canvasFingerprint: string;   // Canvas指纹
    fonts: string[];             // 字体列表
    plugins: string[];           // 插件列表
}
```

### MobileFingerprint

移动设备指纹对象。

```typescript
interface MobileFingerprint extends Fingerprint {
    maxTouchPoints: number;      // 最大触摸点数
    orientation: string;         // 屏幕方向
    devicePixelRatio: number;    // 设备像素比
}
```

### DataStats

数据统计对象。

```typescript
interface DataStats {
    totalSize: number;           // 总大小（字节）
    fileCount: number;           // 文件数量
    directories: {               // 目录统计
        [key: string]: {
            size: number;        // 目录大小
            fileCount: number;   // 文件数量
        }
    };
}
```

### ConfigOptions

配置选项对象。

```typescript
interface ConfigOptions {
    browser: {
        startUrl: string;        // 起始URL
        windowWidth: number;     // 窗口宽度
        windowHeight: number;    // 窗口高度
        userDataDir: string;     // 用户数据目录
        enableDevTools: boolean; // 启用开发工具
    };
    fingerprint: {
        randomizeUserAgent: boolean;  // 随机化UA
        randomizeScreen: boolean;     // 随机化屏幕
        randomizeWebGL: boolean;      // 随机化WebGL
        // ... 更多选项
    };
    dataCleaning: {
        clearOnExit: boolean;    // 退出时清理
        clearCookies: boolean;   // 清理Cookie
        clearCache: boolean;     // 清理缓存
        // ... 更多选项
    };
}
```

## ❌ 错误处理

### 错误类型

#### FingerprintError

指纹相关错误。

```javascript
class FingerprintError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'FingerprintError';
        this.code = code;
    }
}
```

#### DataCleaningError

数据清理错误。

```javascript
class DataCleaningError extends Error {
    constructor(message, path) {
        super(message);
        this.name = 'DataCleaningError';
        this.path = path;
    }
}
```

#### ConfigError

配置错误。

```javascript
class ConfigError extends Error {
    constructor(message, key) {
        super(message);
        this.name = 'ConfigError';
        this.key = key;
    }
}
```

### 错误处理示例

```javascript
try {
    const fingerprint = generator.generate();
} catch (error) {
    if (error instanceof FingerprintError) {
        console.error('指纹生成失败:', error.message);
        // 使用默认指纹
        fingerprint = getDefaultFingerprint();
    } else {
        throw error;
    }
}
```

## 📡 事件系统

### 事件类型

#### 应用事件

```javascript
// 应用启动完成
browser.on('ready', () => {
    console.log('应用已准备就绪');
});

// 窗口创建完成
browser.on('window-created', (window) => {
    console.log('窗口已创建');
});

// 指纹应用完成
browser.on('fingerprint-applied', (fingerprint) => {
    console.log('指纹已应用:', fingerprint);
});

// 数据清理完成
browser.on('data-cleaned', (stats) => {
    console.log('数据清理完成:', stats);
});
```

#### 错误事件

```javascript
// 指纹生成错误
generator.on('error', (error) => {
    console.error('指纹生成错误:', error);
});

// 数据清理错误
cleaner.on('error', (error) => {
    console.error('数据清理错误:', error);
});
```

### 事件监听示例

```javascript
const browser = new RandomFingerprintBrowser();

// 监听应用事件
browser.on('ready', () => {
    console.log('浏览器已准备就绪');
});

browser.on('fingerprint-applied', (fingerprint) => {
    console.log('当前指纹:', fingerprint.userAgent);
});

browser.on('error', (error) => {
    console.error('应用错误:', error);
});

// 启动应用
await browser.initialize();
```

## 🔧 使用示例

### 基础使用

```javascript
const { RandomFingerprintBrowser } = require('./src/main');

async function main() {
    const browser = new RandomFingerprintBrowser();
    
    try {
        // 初始化应用
        await browser.initialize();
        
        // 应用会自动生成指纹并启动浏览器
        console.log('浏览器已启动');
        
    } catch (error) {
        console.error('启动失败:', error);
    }
}

main();
```

### 自定义配置

```javascript
const { Config, RandomFingerprintBrowser } = require('./src/main');

async function customBrowser() {
    const config = new Config();
    
    // 自定义配置
    config.set('browser.windowWidth', 1366);
    config.set('browser.windowHeight', 768);
    config.set('browser.startUrl', 'https://example.com');
    
    const browser = new RandomFingerprintBrowser();
    browser.config = config;
    
    await browser.initialize();
}

customBrowser();
```

### 手动指纹生成

```javascript
const { FingerprintGenerator, FingerprintInjector } = require('./src/main');

// 生成自定义指纹
const generator = new FingerprintGenerator();
const fingerprint = generator.generate();

// 修改特定属性
fingerprint.userAgent = 'Custom User Agent';
fingerprint.screenWidth = 1920;
fingerprint.screenHeight = 1080;

// 注入到页面
const injector = new FingerprintInjector();
const script = injector.generateInjectionScript(fingerprint);

console.log('生成的注入脚本:', script);
```

---

**API参考文档版本**: v1.0.0  
**最后更新**: 2024年6月11日  
**维护者**: 开发团队
