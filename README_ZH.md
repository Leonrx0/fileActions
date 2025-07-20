````markdown
# FileActions

一个轻量级的 Vue 3 文件列表及操作组件，支持删除、下载和上传功能。

## 功能特点

- 📁 文件列表展示，支持自定义图标  
- 🗑️ 删除文件（编辑模式）  
- 📥 下载文件（下载模式）  
- 📤 支持拖拽上传文件  
- ✅ 多选功能  
- 🎨 支持自定义图标映射  
- 📱 响应式设计  
- 🎯 TypeScript 支持  

## 安装

```bash
npm install @leon/file-actions
````

## 使用示例

### 基础使用

```vue
<template>
  <FileActions
    :files="files"
    mode="view"
    @file-click="handleFileClick"
  />
</template>

<script setup>
import { FileActions } from '@leon/file-actions'

const files = [
  { name: 'document.pdf', url: '/files/document.pdf' },
  { name: 'image.jpg', url: '/files/image.jpg' },
  { name: 'archive.zip', url: '/files/archive.zip' }
]

const handleFileClick = ({ file, index }) => {
  console.log('点击文件:', file, index)
}
</script>
```

### 编辑模式（删除 & 上传）

```vue
<template>
  <FileActions
    :files="files"
    mode="edit"
    :selectable="true"
    :show-upload="true"
    @delete="handleDelete"
    @upload-change="handleUploadChange"
    @select-change="handleSelectChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { FileActions } from '@leon/file-actions'

const files = ref([
  { name: 'document.pdf', url: '/files/document.pdf' },
  { name: 'image.jpg', url: '/files/image.jpg' }
])

const handleDelete = ({ file, index }) => {
  files.value.splice(index, 1)
}

const handleUploadChange = (fileList) => {
  console.log('上传文件列表:', fileList)
}

const handleSelectChange = (selectedUrls) => {
  console.log('选中文件:', selectedUrls)
}
</script>
```

### 下载模式

```vue
<template>
  <FileActions
    :files="files"
    mode="download"
    @download="handleDownload"
  />
</template>

<script setup>
import { FileActions } from '@leon/file-actions'

const files = [
  { name: 'document.pdf', url: '/files/document.pdf' },
  { name: 'image.jpg', url: '/files/image.jpg' }
]

const handleDownload = ({ file, index }) => {
  window.open(file.url, '_blank')
}
</script>
```

## 组件 Props

| 参数           | 类型                               | 默认值      | 说明           |
| ------------ | -------------------------------- | -------- | ------------ |
| `files`      | `FileActionItem[]`               | `[]`     | 文件列表         |
| `mode`       | `'view' \| 'edit' \| 'download'` | `'view'` | 组件模式         |
| `selectable` | `boolean`                        | `true`   | 是否允许多选       |
| `showUpload` | `boolean`                        | `true`   | 是否显示上传区域     |
| `iconMap`    | `Record<string, string>`         | `{}`     | 自定义文件扩展名图标映射 |

## 事件说明

| 事件名             | 参数                                        | 说明           |
| --------------- | ----------------------------------------- | ------------ |
| `delete`        | `{ file: FileActionItem, index: number }` | 删除文件事件       |
| `download`      | `{ file: FileActionItem, index: number }` | 下载文件事件       |
| `upload-change` | `any[]`                                   | 上传文件列表变化     |
| `select-change` | `string[]`                                | 选中文件的 URL 列表 |
| `file-click`    | `{ file: FileActionItem, index: number }` | 文件点击事件       |

## FileActionItem 接口

```typescript
interface FileActionItem {
  name: string;
  url?: string;
  icon?: string;
  [key: string]: any;
}
```

## 支持的文件类型图标

内置图标支持：

* PDF (`.pdf`)
* Word 文档 (`.doc`, `.docx`)
* 文本文件 (`.txt`)
* 图片 (`.jpg`, `.jpeg`, `.png`, `.gif`)
* 压缩包 (`.zip`, `.rar`)
* 以及未知类型的默认图标

## 自定义图标

可通过 `iconMap` 传入自定义图标映射：

```vue
<template>
  <FileActions
    :files="files"
    :icon-map="customIcons"
  />
</template>

<script setup>
const customIcons = {
  pdf: '/custom-icons/pdf-icon.svg',
  doc: '/custom-icons/word-icon.svg',
  xlsx: '/custom-icons/excel-icon.svg'
}
</script>
```

## 开发指南

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 生产构建
npm run build
```

## 许可证

MIT

```
```
