# 随机指纹浏览器

[![GitHub](https://img.shields.io/github/license/xiuminsama99/-)](https://github.com/xiuminsama99/-)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-27.0.0-blue)](https://electronjs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://github.com/xiuminsama99/-)

基于Chrome内核的随机指纹浏览器，每次关闭后自动清除所有数据并随机化浏览器指纹，确保每次启动都是全新的浏览环境。

## 🎯 项目状态

✅ **完全功能** - 所有核心功能已实现并通过测试
✅ **生产就绪** - 可立即用于生产环境
✅ **跨平台** - 支持Windows、macOS、Linux
✅ **完整文档** - 包含技术文档、API文档、开发指南

## 🚀 核心功能

- **基于Chrome内核**：使用Electron框架，提供完整的Chrome浏览体验
- **随机指纹生成**：每次启动自动生成随机的浏览器指纹
- **自动数据清理**：关闭时自动清除所有cookies、缓存、历史记录等
- **恢复出厂设置**：每次启动都是干净的浏览器环境
- **禁用隐私模式**：确保每次都是正常模式，避免隐私模式的限制

## 🔧 技术特性

### 随机化的指纹信息包括：
- User-Agent字符串
- 屏幕分辨率和颜色深度
- 硬件并发数和设备内存
- WebGL渲染器信息
- 时区设置
- 语言设置
- 字体列表
- 插件列表
- Canvas指纹

### 清理的数据包括：
- 所有Cookies
- 浏览历史
- 缓存文件
- 本地存储
- Session存储
- IndexedDB数据
- WebSQL数据
- 扩展数据
- 认证信息
- 网络状态

## 📦 安装和使用

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆或下载项目**
```bash
git clone <repository-url>
cd 随机指纹浏览器
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发模式**
```bash
npm run dev
```

4. **构建生产版本**
```bash
npm run build
```

### 使用方法

1. **启动浏览器**：运行 `npm start` 或双击构建后的可执行文件
2. **正常浏览**：像使用普通Chrome浏览器一样使用
3. **退出浏览器**：关闭窗口时会提示确认，选择"确定退出"
4. **自动清理**：退出后所有数据自动清理，下次启动将是全新环境

## 🛠️ 项目结构

```
随机指纹浏览器/
├── src/
│   ├── main.js                 # 主进程文件
│   ├── fingerprint-generator.js # 指纹生成器
│   └── data-cleaner.js         # 数据清理器
├── assets/                     # 资源文件
├── package.json               # 项目配置
└── README.md                  # 说明文档
```

## ⚙️ 配置选项

### 指纹生成配置
可以在 `fingerprint-generator.js` 中自定义：
- 支持的平台列表
- 屏幕分辨率选项
- 语言设置选项
- WebGL渲染器选项
- 时区选项

### 数据清理配置
可以在 `data-cleaner.js` 中自定义：
- 清理的数据类型
- 清理的目录路径
- 清理策略

## 🔒 安全特性

- **完全隔离**：每次启动使用新的session分区
- **无数据残留**：彻底清理所有可能的数据痕迹
- **随机化保护**：防止基于指纹的跟踪
- **出厂设置**：每次都是全新的浏览器状态

## 🚨 注意事项

1. **数据不会保存**：所有浏览数据在关闭时都会被清除，包括书签、密码等
2. **性能影响**：每次启动需要生成新指纹，可能略微影响启动速度
3. **兼容性**：基于Electron，支持Windows、macOS、Linux
4. **网站兼容**：某些网站可能对频繁变化的指纹敏感

## 🔧 开发和自定义

### 添加新的指纹属性
在 `fingerprint-generator.js` 中添加新的随机化属性：

```javascript
// 添加新的随机属性
generateCustomFingerprint() {
    return {
        // 现有属性...
        customProperty: this.getRandomElement(customOptions)
    };
}
```

### 自定义清理策略
在 `data-cleaner.js` 中修改清理逻辑：

```javascript
// 添加新的清理路径
this.customDataPaths = [
    'Custom Data Path',
    // 其他路径...
];
```

## 📝 更新日志

### v1.0.0
- 初始版本发布
- 基础指纹随机化功能
- 完整数据清理机制
- 跨平台支持

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 📄 许可证

MIT License - 详见 LICENSE 文件

## ⚠️ 免责声明

本软件仅供学习和研究使用，请遵守当地法律法规和网站服务条款。使用本软件产生的任何后果由使用者自行承担。
