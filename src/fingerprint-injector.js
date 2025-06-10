class FingerprintInjector {
    constructor() {
        this.injectedScripts = new Set();
    }

    // 生成完整的指纹注入脚本
    generateInjectionScript(fingerprint) {
        return `
(function() {
    'use strict';
    
    console.log('🔒 正在应用浏览器指纹伪装...');
    
    // 防止重复注入
    if (window.__fingerprintInjected) {
        return;
    }
    window.__fingerprintInjected = true;
    
    // 保存原始方法
    const originalDefineProperty = Object.defineProperty;
    const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    
    // 安全的属性重定义函数
    function safeDefineProperty(obj, prop, descriptor) {
        try {
            return originalDefineProperty(obj, prop, {
                ...descriptor,
                configurable: true,
                enumerable: true
            });
        } catch (e) {
            console.warn('定义属性失败:', prop, e);
        }
    }
    
    // 1. Navigator属性伪装
    ${this.generateNavigatorScript(fingerprint)}
    
    // 2. Screen属性伪装
    ${this.generateScreenScript(fingerprint)}
    
    // 3. WebGL指纹伪装
    ${this.generateWebGLScript(fingerprint)}
    
    // 4. Canvas指纹伪装
    ${this.generateCanvasScript(fingerprint)}
    
    // 5. 音频指纹伪装
    ${this.generateAudioScript(fingerprint)}
    
    // 6. 时区和日期伪装
    ${this.generateDateScript(fingerprint)}
    
    // 7. 字体检测伪装
    ${this.generateFontScript(fingerprint)}
    
    // 8. 插件检测伪装
    ${this.generatePluginScript(fingerprint)}
    
    // 9. 网络信息伪装
    ${this.generateNetworkScript(fingerprint)}
    
    // 10. 电池API伪装
    ${this.generateBatteryScript(fingerprint)}
    
    console.log('✅ 浏览器指纹伪装已应用');
    console.log('指纹信息:', ${JSON.stringify(fingerprint, null, 2)});
    
})();
        `;
    }

    generateNavigatorScript(fingerprint) {
        return `
    // Navigator属性重写
    safeDefineProperty(navigator, 'userAgent', {
        get: () => '${fingerprint.userAgent}'
    });
    
    safeDefineProperty(navigator, 'platform', {
        get: () => '${fingerprint.platform}'
    });
    
    safeDefineProperty(navigator, 'language', {
        get: () => '${fingerprint.language.split(',')[0]}'
    });
    
    safeDefineProperty(navigator, 'languages', {
        get: () => ${JSON.stringify(fingerprint.language.split(',').map(l => l.split(';')[0].trim()))}
    });
    
    safeDefineProperty(navigator, 'hardwareConcurrency', {
        get: () => ${fingerprint.hardwareConcurrency}
    });
    
    safeDefineProperty(navigator, 'deviceMemory', {
        get: () => ${fingerprint.deviceMemory}
    });
    
    safeDefineProperty(navigator, 'maxTouchPoints', {
        get: () => ${fingerprint.maxTouchPoints || 0}
    });
    
    safeDefineProperty(navigator, 'cookieEnabled', {
        get: () => true
    });
    
    safeDefineProperty(navigator, 'doNotTrack', {
        get: () => null
    });
        `;
    }

    generateScreenScript(fingerprint) {
        return `
    // Screen属性重写
    safeDefineProperty(screen, 'width', {
        get: () => ${fingerprint.screenWidth}
    });
    
    safeDefineProperty(screen, 'height', {
        get: () => ${fingerprint.screenHeight}
    });
    
    safeDefineProperty(screen, 'availWidth', {
        get: () => ${fingerprint.screenWidth}
    });
    
    safeDefineProperty(screen, 'availHeight', {
        get: () => ${fingerprint.screenHeight - 40}
    });
    
    safeDefineProperty(screen, 'colorDepth', {
        get: () => ${fingerprint.colorDepth}
    });
    
    safeDefineProperty(screen, 'pixelDepth', {
        get: () => ${fingerprint.colorDepth}
    });
        `;
    }

    generateWebGLScript(fingerprint) {
        return `
    // WebGL指纹伪装
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
        switch(parameter) {
            case 37445: // UNMASKED_VENDOR_WEBGL
                return '${fingerprint.webglVendor}';
            case 37446: // UNMASKED_RENDERER_WEBGL
                return '${fingerprint.webglRenderer}';
            case 7936: // VERSION
                return 'WebGL 1.0';
            case 7937: // SHADING_LANGUAGE_VERSION
                return 'WebGL GLSL ES 1.0';
            default:
                return getParameter.call(this, parameter);
        }
    };
    
    // WebGL2支持
    if (window.WebGL2RenderingContext) {
        const getParameter2 = WebGL2RenderingContext.prototype.getParameter;
        WebGL2RenderingContext.prototype.getParameter = function(parameter) {
            switch(parameter) {
                case 37445:
                    return '${fingerprint.webglVendor}';
                case 37446:
                    return '${fingerprint.webglRenderer}';
                default:
                    return getParameter2.call(this, parameter);
            }
        };
    }
        `;
    }

    generateCanvasScript(fingerprint) {
        return `
    // Canvas指纹伪装
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    const toBlob = HTMLCanvasElement.prototype.toBlob;
    const getImageData = CanvasRenderingContext2D.prototype.getImageData;
    
    HTMLCanvasElement.prototype.toDataURL = function(...args) {
        const result = toDataURL.apply(this, args);
        // 添加轻微的随机噪声
        return result.replace(/data:image\\/png;base64,/, 'data:image/png;base64,${fingerprint.canvasFingerprint}');
    };
    
    CanvasRenderingContext2D.prototype.getImageData = function(...args) {
        const result = getImageData.apply(this, args);
        // 对像素数据添加轻微噪声
        const data = result.data;
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < 0.001) {
                data[i] = Math.min(255, data[i] + Math.floor(Math.random() * 3) - 1);
                data[i + 1] = Math.min(255, data[i + 1] + Math.floor(Math.random() * 3) - 1);
                data[i + 2] = Math.min(255, data[i + 2] + Math.floor(Math.random() * 3) - 1);
            }
        }
        return result;
    };
        `;
    }

    generateAudioScript(fingerprint) {
        return `
    // 音频指纹伪装
    if (window.AudioContext || window.webkitAudioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const createAnalyser = AudioContext.prototype.createAnalyser;
        
        AudioContext.prototype.createAnalyser = function() {
            const analyser = createAnalyser.call(this);
            const getFloatFrequencyData = analyser.getFloatFrequencyData;
            
            analyser.getFloatFrequencyData = function(array) {
                getFloatFrequencyData.call(this, array);
                // 添加轻微噪声
                for (let i = 0; i < array.length; i++) {
                    array[i] += (Math.random() - 0.5) * 0.0001;
                }
            };
            
            return analyser;
        };
    }
        `;
    }

    generateDateScript(fingerprint) {
        return `
    // 时区伪装
    const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = function() {
        return ${fingerprint.timezoneOffset};
    };
    
    // Intl.DateTimeFormat伪装
    if (window.Intl && window.Intl.DateTimeFormat) {
        const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
        Intl.DateTimeFormat.prototype.resolvedOptions = function() {
            const options = originalResolvedOptions.call(this);
            options.timeZone = '${fingerprint.timezone || 'UTC'}';
            return options;
        };
    }
        `;
    }

    generateFontScript(fingerprint) {
        return `
    // 字体检测伪装
    const fonts = ${JSON.stringify(fingerprint.fonts || [])};
    
    // 重写字体检测相关方法
    if (document.fonts && document.fonts.check) {
        const originalCheck = document.fonts.check;
        document.fonts.check = function(font) {
            const fontFamily = font.match(/['"]([^'"]+)['"]/);
            if (fontFamily && fonts.includes(fontFamily[1])) {
                return true;
            }
            return originalCheck.call(this, font);
        };
    }
        `;
    }

    generatePluginScript(fingerprint) {
        return `
    // 插件检测伪装
    const plugins = ${JSON.stringify(fingerprint.plugins || [])};
    
    safeDefineProperty(navigator, 'plugins', {
        get: () => {
            const pluginArray = [];
            plugins.forEach((name, index) => {
                pluginArray[index] = {
                    name: name,
                    filename: name.toLowerCase().replace(/\\s+/g, '') + '.dll',
                    description: name,
                    length: 1
                };
            });
            pluginArray.length = plugins.length;
            return pluginArray;
        }
    });
        `;
    }

    generateNetworkScript(fingerprint) {
        return `
    // 网络信息伪装
    if (navigator.connection) {
        safeDefineProperty(navigator.connection, 'effectiveType', {
            get: () => '${fingerprint.connectionType || '4g'}'
        });
        
        safeDefineProperty(navigator.connection, 'downlink', {
            get: () => ${fingerprint.downlink || 10}
        });
        
        safeDefineProperty(navigator.connection, 'rtt', {
            get: () => ${fingerprint.rtt || 100}
        });
    }
        `;
    }

    generateBatteryScript(fingerprint) {
        return `
    // 电池API伪装
    if (navigator.getBattery) {
        const originalGetBattery = navigator.getBattery;
        navigator.getBattery = function() {
            return Promise.resolve({
                charging: ${fingerprint.batteryCharging || true},
                chargingTime: ${fingerprint.batteryChargingTime || 0},
                dischargingTime: ${fingerprint.batteryDischargingTime || Infinity},
                level: ${fingerprint.batteryLevel || 1.0}
            });
        };
    }
        `;
    }

    // 注入脚本到页面
    injectToPage(webContents, fingerprint) {
        const script = this.generateInjectionScript(fingerprint);
        
        // 在页面加载前注入
        webContents.executeJavaScript(script, true).catch(err => {
            console.error('指纹注入失败:', err);
        });
        
        // 标记已注入
        this.injectedScripts.add(webContents.id);
    }

    // 检查是否已注入
    isInjected(webContentsId) {
        return this.injectedScripts.has(webContentsId);
    }

    // 清理注入记录
    cleanup(webContentsId) {
        this.injectedScripts.delete(webContentsId);
    }
}

module.exports = FingerprintInjector;
