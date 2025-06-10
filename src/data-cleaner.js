const { session, app } = require('electron');
const fs = require('fs').promises;
const path = require('path');

class DataCleaner {
    constructor() {
        this.userDataPath = app.getPath('userData');
        this.tempDataPaths = [
            'Cache',
            'Code Cache',
            'GPUCache',
            'Session Storage',
            'Local Storage',
            'IndexedDB',
            'WebSQL',
            'Cookies',
            'Network Persistent State',
            'TransportSecurity',
            'HSTS',
            'Certificate Transparency',
            'Reporting and NEL',
            'Network Action Predictor',
            'Shortcuts',
            'Top Sites',
            'Visited Links',
            'Web Data',
            'History',
            'Login Data',
            'Preferences',
            'Secure Preferences',
            'Extension Cookies',
            'Extension State',
            'Extensions',
            'Local Extension Settings',
            'Sync Extension Settings',
            'Managed Extension Settings',
            'Platform Notifications',
            'GCM Store',
            'blob_storage',
            'databases',
            'File System',
            'Service Worker'
        ];
    }

    async cleanAllData() {
        console.log('开始清理所有浏览器数据...');
        
        try {
            // 清理所有session数据
            await this.cleanSessionData();
            
            // 清理文件系统中的数据
            await this.cleanFileSystemData();
            
            // 清理缓存
            await this.cleanCache();
            
            // 重置所有设置
            await this.resetSettings();
            
            console.log('所有数据清理完成');
        } catch (error) {
            console.error('清理数据时发生错误:', error);
            // 即使出错也要尝试基本清理
            await this.forceCleanBasicData();
        }
    }

    async cleanSessionData() {
        try {
            // 获取默认session
            const defaultSession = session.defaultSession;
            
            if (defaultSession) {
                // 清除所有cookies
                await defaultSession.cookies.flushStore();
                const cookies = await defaultSession.cookies.get({});
                for (const cookie of cookies) {
                    await defaultSession.cookies.remove(
                        `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`,
                        cookie.name
                    );
                }
                
                // 清除缓存
                await defaultSession.clearCache();
                
                // 清除存储数据
                await defaultSession.clearStorageData({
                    storages: [
                        'appcache',
                        'cookies',
                        'filesystem',
                        'indexdb',
                        'localstorage',
                        'shadercache',
                        'websql',
                        'serviceworkers',
                        'cachestorage'
                    ]
                });
                
                // 清除认证缓存
                await defaultSession.clearAuthCache();
                
                // 清除主机解析缓存
                await defaultSession.clearHostResolverCache();
                
                console.log('Session数据清理完成');
            }
        } catch (error) {
            console.error('清理Session数据时出错:', error);
        }
    }

    async cleanFileSystemData() {
        try {
            // 清理用户数据目录中的各种缓存和数据文件
            for (const dataPath of this.tempDataPaths) {
                const fullPath = path.join(this.userDataPath, dataPath);
                await this.removeDirectory(fullPath);
            }
            
            // 清理临时文件
            const tempPath = app.getPath('temp');
            const electronTempPath = path.join(tempPath, 'electron-*');
            await this.removeGlobPattern(electronTempPath);
            
            console.log('文件系统数据清理完成');
        } catch (error) {
            console.error('清理文件系统数据时出错:', error);
        }
    }

    async cleanCache() {
        try {
            // 清理各种缓存目录
            const cachePaths = [
                path.join(this.userDataPath, 'ShaderCache'),
                path.join(this.userDataPath, 'GPUCache'),
                path.join(this.userDataPath, 'Code Cache'),
                path.join(this.userDataPath, 'Cache')
            ];
            
            for (const cachePath of cachePaths) {
                await this.removeDirectory(cachePath);
            }
            
            console.log('缓存清理完成');
        } catch (error) {
            console.error('清理缓存时出错:', error);
        }
    }

    async resetSettings() {
        try {
            // 删除设置文件以恢复默认设置
            const settingsFiles = [
                'Preferences',
                'Secure Preferences',
                'Local State',
                'First Run',
                'Last Browser',
                'Last Version'
            ];
            
            for (const settingsFile of settingsFiles) {
                const filePath = path.join(this.userDataPath, settingsFile);
                await this.removeFile(filePath);
            }
            
            console.log('设置重置完成');
        } catch (error) {
            console.error('重置设置时出错:', error);
        }
    }

    async removeDirectory(dirPath) {
        try {
            const stats = await fs.stat(dirPath);
            if (stats.isDirectory()) {
                await fs.rmdir(dirPath, { recursive: true });
                console.log(`已删除目录: ${dirPath}`);
            }
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.warn(`删除目录失败 ${dirPath}:`, error.message);
            }
        }
    }

    async removeFile(filePath) {
        try {
            await fs.unlink(filePath);
            console.log(`已删除文件: ${filePath}`);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.warn(`删除文件失败 ${filePath}:`, error.message);
            }
        }
    }

    async removeGlobPattern(pattern) {
        try {
            const glob = require('glob');
            const files = glob.sync(pattern);
            
            for (const file of files) {
                await this.removeDirectory(file);
            }
        } catch (error) {
            console.warn(`删除模式匹配文件失败 ${pattern}:`, error.message);
        }
    }

    async forceCleanBasicData() {
        try {
            console.log('执行强制基本清理...');
            
            // 至少清理最重要的数据
            const criticalPaths = [
                'Cookies',
                'Local Storage',
                'Session Storage',
                'Cache'
            ];
            
            for (const criticalPath of criticalPaths) {
                const fullPath = path.join(this.userDataPath, criticalPath);
                await this.removeDirectory(fullPath);
            }
            
            console.log('强制基本清理完成');
        } catch (error) {
            console.error('强制清理也失败了:', error);
        }
    }

    // 获取数据使用情况统计
    async getDataUsageStats() {
        const stats = {
            totalSize: 0,
            fileCount: 0,
            directories: {}
        };
        
        try {
            for (const dataPath of this.tempDataPaths) {
                const fullPath = path.join(this.userDataPath, dataPath);
                const dirStats = await this.getDirectoryStats(fullPath);
                stats.directories[dataPath] = dirStats;
                stats.totalSize += dirStats.size;
                stats.fileCount += dirStats.fileCount;
            }
        } catch (error) {
            console.error('获取数据统计时出错:', error);
        }
        
        return stats;
    }

    async getDirectoryStats(dirPath) {
        const stats = { size: 0, fileCount: 0 };
        
        try {
            const items = await fs.readdir(dirPath);
            
            for (const item of items) {
                const itemPath = path.join(dirPath, item);
                const itemStats = await fs.stat(itemPath);
                
                if (itemStats.isDirectory()) {
                    const subStats = await this.getDirectoryStats(itemPath);
                    stats.size += subStats.size;
                    stats.fileCount += subStats.fileCount;
                } else {
                    stats.size += itemStats.size;
                    stats.fileCount++;
                }
            }
        } catch (error) {
            // 目录不存在或无法访问
        }
        
        return stats;
    }

    // 格式化文件大小显示
    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
}

module.exports = DataCleaner;
