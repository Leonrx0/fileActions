# 📦 NPM 包发布指南

## 🎯 发布前准备

### 1. 检查文件结构
确保以下文件存在且正确：
```
FileActions/
├── dist/
│   ├── file-actions.es.js      # ES 模块版本
│   ├── file-actions.umd.js     # UMD 版本
│   ├── style.css               # 样式文件
│   └── index.d.ts              # TypeScript 声明文件
├── src/
│   ├── fileAction.vue          # 主组件
│   ├── index.ts                # 入口文件
│   └── env.d.ts                # 环境声明
├── package.json                # 包配置
├── README.md                   # 文档
├── LICENSE                     # 许可证
└── .npmignore                  # 忽略文件
```

### 2. 验证构建
```bash
# 运行预发布检查
npm run prepublishOnly

# 或手动检查
node scripts/prepublish.js
```

### 3. 测试包内容
```bash
# 查看将要发布的文件
npm pack --dry-run
```

## 🚀 发布步骤

### 1. 登录 NPM
```bash
npm login
```

### 2. 检查包名可用性
```bash
npm search @leon/file-actions
```

### 3. 发布包
```bash
npm publish
```

### 4. 验证发布
```bash
npm view @leon/file-actions
```

## 📋 版本管理

### 语义化版本
- `patch` (1.0.0 → 1.0.1): 修复 bug
- `minor` (1.0.0 → 1.1.0): 新功能，向后兼容
- `major` (1.0.0 → 2.0.0): 破坏性变更

### 更新版本
```bash
# 自动更新版本号
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# 手动设置版本
npm version 1.2.3
```

## 🔧 配置说明

### package.json 关键字段
```json
{
  "name": "@leon/file-actions",           // 包名
  "version": "0.1.0",                     // 版本号
  "main": "dist/file-actions.umd.js",     // CommonJS 入口
  "module": "dist/file-actions.es.js",    // ES 模块入口
  "types": "dist/index.d.ts",             // TypeScript 声明
  "exports": {                            // 导出配置
    ".": {
      "import": "./dist/file-actions.es.js",
      "require": "./dist/file-actions.umd.js",
      "types": "./dist/index.d.ts"
    },
    "./dist/style.css": "./dist/style.css"
  },
  "files": ["dist", "src"],               // 发布文件
  "peerDependencies": {                   // 对等依赖
    "vue": "^3.4.0",
    "element-plus": "^2.7.0"
  }
}
```

### .npmignore 配置
```
# 开发文件
.vscode/
.idea/
*.log
*.tsbuildinfo

# 构建工具
vite.config.ts
tsconfig.json
.env*

# 测试文件
test.*
*.test.*
*.spec.*

# 文档
README.md
CHANGELOG.md
docs/

# 开发依赖
node_modules/
.git/
.gitignore

# 临时文件
.temp/
.cache/
dist/.temp/
```

## 🎯 使用示例

### 安装
```bash
npm install @leon/file-actions
```

### 基本使用
```vue
<template>
  <FileActions
    :files="files"
    mode="edit"
    @delete="handleDelete"
  />
</template>

<script setup>
import { FileActions } from '@leon/file-actions'
import '@leon/file-actions/dist/style.css'

const files = [
  { name: 'document.pdf', url: '/files/document.pdf' }
]

const handleDelete = ({ file, index }) => {
  console.log('删除文件:', file.name)
}
</script>
```

### 全局注册
```javascript
import { createApp } from 'vue'
import { FileActions } from '@leon/file-actions'
import '@leon/file-actions/dist/style.css'

const app = createApp(App)
app.use(FileActions)
app.mount('#app')
```

## 🔍 发布后验证

### 1. 检查包信息
```bash
npm view @leon/file-actions
```

### 2. 测试安装
```bash
# 创建测试目录
mkdir test-install
cd test-install

# 初始化项目
npm init -y

# 安装包
npm install @leon/file-actions

# 检查安装的文件
ls node_modules/@leon/file-actions/
```

### 3. 验证导入
```javascript
// test.js
const { FileActions } = require('@leon/file-actions')
console.log('导入成功:', FileActions)
```

## 🚨 常见问题

### 1. 包名冲突
如果包名已被占用，需要修改 `package.json` 中的 `name` 字段。

### 2. 版本冲突
确保版本号符合语义化版本规范。

### 3. 文件过大
检查 `dist` 目录大小，优化构建配置。

### 4. 依赖问题
确保 `peerDependencies` 配置正确。

## 📞 支持

如果遇到发布问题：
1. 检查 NPM 账户权限
2. 验证包名可用性
3. 确认所有必要文件存在
4. 查看构建日志

## 🔄 更新流程

1. 修改代码
2. 更新版本号：`npm version patch`
3. 构建：`npm run build`
4. 发布：`npm publish`
5. 验证：`npm view @leon/file-actions` 