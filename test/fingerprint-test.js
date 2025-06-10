const FingerprintGenerator = require('../src/fingerprint-generator');
const DataCleaner = require('../src/data-cleaner');
const Config = require('../src/config');

class FingerprintTest {
    constructor() {
        this.generator = new FingerprintGenerator();
        this.cleaner = new DataCleaner();
        this.config = new Config();
        this.testResults = [];
    }

    // 运行所有测试
    async runAllTests() {
        console.log('🧪 开始运行指纹浏览器测试...\n');
        
        try {
            await this.testFingerprintGeneration();
            await this.testFingerprintUniqueness();
            await this.testConfigValidation();
            await this.testDataCleaning();
            
            this.printTestResults();
        } catch (error) {
            console.error('❌ 测试过程中发生错误:', error);
        }
    }

    // 测试指纹生成
    async testFingerprintGeneration() {
        console.log('📋 测试指纹生成功能...');
        
        try {
            const fingerprint = this.generator.generate();
            
            // 检查必需属性
            const requiredProps = [
                'userAgent', 'platform', 'language', 'screenWidth', 
                'screenHeight', 'colorDepth', 'hardwareConcurrency',
                'deviceMemory', 'webglVendor', 'webglRenderer', 'timezoneOffset'
            ];
            
            const missingProps = requiredProps.filter(prop => !fingerprint.hasOwnProperty(prop));
            
            if (missingProps.length === 0) {
                this.addTestResult('指纹生成', true, '所有必需属性都已生成');
                console.log('✅ 指纹生成测试通过');
                console.log(`   生成的指纹包含 ${Object.keys(fingerprint).length} 个属性`);
            } else {
                this.addTestResult('指纹生成', false, `缺少属性: ${missingProps.join(', ')}`);
                console.log('❌ 指纹生成测试失败');
            }
            
        } catch (error) {
            this.addTestResult('指纹生成', false, error.message);
            console.log('❌ 指纹生成测试出错:', error.message);
        }
    }

    // 测试指纹唯一性
    async testFingerprintUniqueness() {
        console.log('🔄 测试指纹唯一性...');
        
        try {
            const fingerprints = [];
            const testCount = 10;
            
            // 生成多个指纹
            for (let i = 0; i < testCount; i++) {
                fingerprints.push(this.generator.generate());
                // 添加小延迟确保时间戳不同
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            // 检查唯一性
            const uniqueFingerprints = new Set();
            fingerprints.forEach(fp => {
                const key = `${fp.userAgent}-${fp.screenWidth}-${fp.screenHeight}-${fp.webglRenderer}`;
                uniqueFingerprints.add(key);
            });
            
            const uniqueCount = uniqueFingerprints.size;
            const uniqueRate = (uniqueCount / testCount) * 100;
            
            if (uniqueRate >= 80) {
                this.addTestResult('指纹唯一性', true, `唯一率: ${uniqueRate.toFixed(1)}%`);
                console.log(`✅ 指纹唯一性测试通过 (${uniqueCount}/${testCount} 唯一)`);
            } else {
                this.addTestResult('指纹唯一性', false, `唯一率过低: ${uniqueRate.toFixed(1)}%`);
                console.log(`❌ 指纹唯一性测试失败 (${uniqueCount}/${testCount} 唯一)`);
            }
            
        } catch (error) {
            this.addTestResult('指纹唯一性', false, error.message);
            console.log('❌ 指纹唯一性测试出错:', error.message);
        }
    }

    // 测试配置验证
    async testConfigValidation() {
        console.log('⚙️ 测试配置验证...');
        
        try {
            // 测试默认配置
            const errors = this.config.validate();
            
            if (errors.length === 0) {
                this.addTestResult('配置验证', true, '默认配置验证通过');
                console.log('✅ 默认配置验证通过');
            } else {
                this.addTestResult('配置验证', false, `验证错误: ${errors.join(', ')}`);
                console.log('❌ 默认配置验证失败:', errors);
            }
            
            // 测试无效配置
            this.config.set('browser.windowWidth', 500); // 无效宽度
            const invalidErrors = this.config.validate();
            
            if (invalidErrors.length > 0) {
                console.log('✅ 无效配置检测正常');
            } else {
                console.log('⚠️ 无效配置未被检测到');
            }
            
            // 重置配置
            this.config.reset();
            
        } catch (error) {
            this.addTestResult('配置验证', false, error.message);
            console.log('❌ 配置验证测试出错:', error.message);
        }
    }

    // 测试数据清理功能
    async testDataCleaning() {
        console.log('🧹 测试数据清理功能...');
        
        try {
            // 获取数据使用统计
            const stats = await this.cleaner.getDataUsageStats();
            
            if (typeof stats === 'object' && 'totalSize' in stats) {
                this.addTestResult('数据清理', true, `统计功能正常，总大小: ${this.cleaner.formatFileSize(stats.totalSize)}`);
                console.log('✅ 数据清理统计功能正常');
                console.log(`   当前数据使用: ${this.cleaner.formatFileSize(stats.totalSize)}`);
                console.log(`   文件数量: ${stats.fileCount}`);
            } else {
                this.addTestResult('数据清理', false, '统计功能异常');
                console.log('❌ 数据清理统计功能异常');
            }
            
        } catch (error) {
            this.addTestResult('数据清理', false, error.message);
            console.log('❌ 数据清理测试出错:', error.message);
        }
    }

    // 添加测试结果
    addTestResult(testName, passed, details) {
        this.testResults.push({
            name: testName,
            passed: passed,
            details: details,
            timestamp: new Date().toISOString()
        });
    }

    // 打印测试结果摘要
    printTestResults() {
        console.log('\n📊 测试结果摘要');
        console.log('='.repeat(50));
        
        const passedTests = this.testResults.filter(r => r.passed).length;
        const totalTests = this.testResults.length;
        const passRate = (passedTests / totalTests) * 100;
        
        console.log(`总测试数: ${totalTests}`);
        console.log(`通过测试: ${passedTests}`);
        console.log(`失败测试: ${totalTests - passedTests}`);
        console.log(`通过率: ${passRate.toFixed(1)}%`);
        
        console.log('\n详细结果:');
        this.testResults.forEach(result => {
            const status = result.passed ? '✅' : '❌';
            console.log(`${status} ${result.name}: ${result.details}`);
        });
        
        if (passRate === 100) {
            console.log('\n🎉 所有测试都通过了！浏览器已准备就绪。');
        } else if (passRate >= 75) {
            console.log('\n⚠️ 大部分测试通过，浏览器基本可用。');
        } else {
            console.log('\n❌ 多个测试失败，请检查配置和依赖。');
        }
    }

    // 生成测试报告
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.testResults.length,
                passed: this.testResults.filter(r => r.passed).length,
                failed: this.testResults.filter(r => !r.passed).length,
                passRate: (this.testResults.filter(r => r.passed).length / this.testResults.length) * 100
            },
            results: this.testResults,
            environment: {
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch
            }
        };
        
        return JSON.stringify(report, null, 2);
    }

    // 运行性能测试
    async runPerformanceTest() {
        console.log('⚡ 运行性能测试...');
        
        const iterations = 100;
        const startTime = Date.now();
        
        for (let i = 0; i < iterations; i++) {
            this.generator.generate();
        }
        
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        const avgTime = totalTime / iterations;
        
        console.log(`生成 ${iterations} 个指纹耗时: ${totalTime}ms`);
        console.log(`平均每个指纹: ${avgTime.toFixed(2)}ms`);
        
        if (avgTime < 10) {
            console.log('✅ 性能测试通过 (< 10ms per fingerprint)');
        } else {
            console.log('⚠️ 性能可能需要优化 (> 10ms per fingerprint)');
        }
    }
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
    const test = new FingerprintTest();
    test.runAllTests().then(() => {
        console.log('\n🔧 运行性能测试...');
        return test.runPerformanceTest();
    }).then(() => {
        console.log('\n📄 生成测试报告...');
        const report = test.generateReport();
        console.log('测试报告已生成，可保存到文件中。');
    }).catch(error => {
        console.error('测试执行失败:', error);
        process.exit(1);
    });
}

module.exports = FingerprintTest;
