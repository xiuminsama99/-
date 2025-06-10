const userAgents = require('user-agents');

class FingerprintGenerator {
    constructor() {
        this.platforms = ['Win32', 'MacIntel', 'Linux x86_64', 'Linux i686'];
        this.languages = [
            'en-US,en;q=0.9',
            'zh-CN,zh;q=0.9,en;q=0.8',
            'ja-JP,ja;q=0.9,en;q=0.8',
            'ko-KR,ko;q=0.9,en;q=0.8',
            'fr-FR,fr;q=0.9,en;q=0.8',
            'de-DE,de;q=0.9,en;q=0.8',
            'es-ES,es;q=0.9,en;q=0.8'
        ];
        
        this.screenResolutions = [
            { width: 1920, height: 1080 },
            { width: 1366, height: 768 },
            { width: 1440, height: 900 },
            { width: 1536, height: 864 },
            { width: 1280, height: 720 },
            { width: 1600, height: 900 },
            { width: 2560, height: 1440 },
            { width: 1920, height: 1200 }
        ];
        
        this.colorDepths = [24, 32];
        this.hardwareConcurrencies = [2, 4, 6, 8, 12, 16];
        this.deviceMemories = [2, 4, 8, 16];
        
        this.webglVendors = [
            'Google Inc.',
            'Mozilla',
            'WebKit',
            'Microsoft Corporation'
        ];
        
        this.webglRenderers = [
            'ANGLE (Intel(R) HD Graphics 620 Direct3D11 vs_5_0 ps_5_0)',
            'ANGLE (NVIDIA GeForce GTX 1060 Direct3D11 vs_5_0 ps_5_0)',
            'ANGLE (AMD Radeon RX 580 Direct3D11 vs_5_0 ps_5_0)',
            'WebKit WebGL',
            'Mozilla WebGL'
        ];
        
        this.timezoneOffsets = [-480, -420, -360, -300, -240, -180, 0, 60, 120, 180, 240, 300, 360, 420, 480, 540];
        
        this.acceptEncodings = [
            'gzip, deflate, br',
            'gzip, deflate',
            'br, gzip, deflate'
        ];
    }

    generate() {
        // 生成随机User-Agent
        const userAgent = new userAgents({ deviceCategory: 'desktop' });
        
        // 随机选择屏幕分辨率
        const resolution = this.getRandomElement(this.screenResolutions);
        
        // 生成完整的指纹对象
        const fingerprint = {
            // 基础信息
            userAgent: userAgent.toString(),
            platform: this.getRandomElement(this.platforms),
            language: this.getRandomElement(this.languages),
            acceptEncoding: this.getRandomElement(this.acceptEncodings),
            
            // 屏幕信息
            screenWidth: resolution.width,
            screenHeight: resolution.height,
            colorDepth: this.getRandomElement(this.colorDepths),
            
            // 硬件信息
            hardwareConcurrency: this.getRandomElement(this.hardwareConcurrencies),
            deviceMemory: this.getRandomElement(this.deviceMemories),
            
            // WebGL信息
            webglVendor: this.getRandomElement(this.webglVendors),
            webglRenderer: this.getRandomElement(this.webglRenderers),
            
            // 时区信息
            timezoneOffset: this.getRandomElement(this.timezoneOffsets),
            
            // 生成时间戳
            timestamp: Date.now(),
            
            // Canvas指纹（简化版）
            canvasFingerprint: this.generateCanvasFingerprint(),
            
            // 字体列表（简化版）
            fonts: this.generateFontList(),
            
            // 插件列表（简化版）
            plugins: this.generatePluginList()
        };
        
        console.log('生成新的浏览器指纹:', fingerprint);
        return fingerprint;
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateCanvasFingerprint() {
        // 生成随机的Canvas指纹字符串
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    generateFontList() {
        const commonFonts = [
            'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
            'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
            'Trebuchet MS', 'Arial Black', 'Impact', 'Lucida Sans Unicode',
            'Tahoma', 'Lucida Console', 'Monaco', 'Courier', 'Bradley Hand ITC'
        ];
        
        // 随机选择一些字体
        const selectedFonts = [];
        const fontCount = this.getRandomInt(10, 18);
        
        for (let i = 0; i < fontCount; i++) {
            const font = this.getRandomElement(commonFonts);
            if (!selectedFonts.includes(font)) {
                selectedFonts.push(font);
            }
        }
        
        return selectedFonts;
    }

    generatePluginList() {
        const commonPlugins = [
            'Chrome PDF Plugin',
            'Chrome PDF Viewer',
            'Native Client',
            'Widevine Content Decryption Module',
            'Shockwave Flash'
        ];
        
        // 随机选择一些插件
        const selectedPlugins = [];
        const pluginCount = this.getRandomInt(2, 5);
        
        for (let i = 0; i < pluginCount; i++) {
            const plugin = this.getRandomElement(commonPlugins);
            if (!selectedPlugins.includes(plugin)) {
                selectedPlugins.push(plugin);
            }
        }
        
        return selectedPlugins;
    }

    // 生成特定类型的指纹（可扩展）
    generateMobileFingerprint() {
        const mobileUserAgent = new userAgents({ deviceCategory: 'mobile' });
        const mobileResolutions = [
            { width: 375, height: 667 },
            { width: 414, height: 736 },
            { width: 360, height: 640 },
            { width: 412, height: 732 }
        ];
        
        const resolution = this.getRandomElement(mobileResolutions);
        
        return {
            userAgent: mobileUserAgent.toString(),
            platform: 'iPhone',
            screenWidth: resolution.width,
            screenHeight: resolution.height,
            // ... 其他移动端特定属性
        };
    }

    generateTabletFingerprint() {
        const tabletUserAgent = new userAgents({ deviceCategory: 'tablet' });
        const tabletResolutions = [
            { width: 768, height: 1024 },
            { width: 1024, height: 768 },
            { width: 800, height: 1280 },
            { width: 1280, height: 800 }
        ];
        
        const resolution = this.getRandomElement(tabletResolutions);
        
        return {
            userAgent: tabletUserAgent.toString(),
            platform: 'iPad',
            screenWidth: resolution.width,
            screenHeight: resolution.height,
            // ... 其他平板特定属性
        };
    }
}

module.exports = FingerprintGenerator;
