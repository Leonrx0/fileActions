#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking package before publish...');

// 检查必要文件是否存在
const requiredFiles = [
  'dist/file-actions.es.js',
  'dist/file-actions.umd.js',
  'dist/style.css',
  'dist/index.d.ts',
  'package.json',
  'README.md',
  'LICENSE'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  process.exit(1);
}

// 检查 package.json 配置
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredFields = ['name', 'version', 'main', 'module', 'types', 'exports'];
const missingFields = requiredFields.filter(field => !packageJson[field]);

if (missingFields.length > 0) {
  console.error('❌ Missing required package.json fields:');
  missingFields.forEach(field => console.error(`   - ${field}`));
  process.exit(1);
}

// 检查 dist 目录大小
const distPath = path.join(__dirname, '../dist');
const files = fs.readdirSync(distPath);
const totalSize = files.reduce((size, file) => {
  const filePath = path.join(distPath, file);
  const stats = fs.statSync(filePath);
  return size + stats.size;
}, 0);

console.log(`📦 Package size: ${(totalSize / 1024).toFixed(2)} KB`);

// 检查版本号格式
const version = packageJson.version;
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('❌ Invalid version format. Use semantic versioning (e.g., 1.0.0)');
  process.exit(1);
}

console.log('✅ Package validation passed!');
console.log(`📋 Package: ${packageJson.name}@${packageJson.version}`);
console.log('🚀 Ready to publish!'); 