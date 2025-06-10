const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 随机指纹浏览器安装程序');
console.log('================================');

// 检查Node.js版本
function checkNodeVersion() {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);
    
    console.log(`📋 检测到Node.js版本: ${version}`);
    
    if (majorVersion < 16) {
        console.error('❌ 错误: 需要Node.js 16.0或更高版本');
        console.log('请访问 https://nodejs.org/ 下载最新版本');
        process.exit(1);
    }
    
    console.log('✅ Node.js版本检查通过');
}

// 安装依赖
function installDependencies() {
    console.log('📦 正在安装依赖包...');
    
    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ 依赖安装完成');
    } catch (error) {
        console.error('❌ 依赖安装失败:', error.message);
        console.log('请检查网络连接或尝试使用淘宝镜像:');
        console.log('npm config set registry https://registry.npmmirror.com');
        process.exit(1);
    }
}

// 创建必要的目录
function createDirectories() {
    const dirs = ['logs', 'temp'];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 创建目录: ${dir}`);
        }
    });
}

// 设置权限（Linux/macOS）
function setPermissions() {
    if (process.platform !== 'win32') {
        try {
            execSync('chmod +x start.sh', { stdio: 'inherit' });
            console.log('✅ 设置执行权限');
        } catch (error) {
            console.warn('⚠️  设置权限失败，请手动执行: chmod +x start.sh');
        }
    }
}

// 主安装流程
async function main() {
    try {
        checkNodeVersion();
        installDependencies();
        createDirectories();
        setPermissions();
        
        console.log('\n🎉 安装完成！');
        console.log('================================');
        console.log('启动方法:');
        
        if (process.platform === 'win32') {
            console.log('  Windows: 双击 start.bat 或运行 npm start');
        } else {
            console.log('  Linux/macOS: 运行 ./start.sh 或 npm start');
        }
        
        console.log('\n📖 更多信息请查看 README.md');
        
    } catch (error) {
        console.error('❌ 安装过程中发生错误:', error.message);
        process.exit(1);
    }
}

main();
