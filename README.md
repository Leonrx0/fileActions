# @leon/file-actions

A lightweight Vue 3 file list + action component with support for delete, download, and upload operations.

[![npm version](https://badge.fury.io/js/%40leon%2Ffile-actions.svg)](https://badge.fury.io/js/%40leon%2Ffile-actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 📁 File list display with customizable icons
- 🗑️ Delete files (edit mode)
- 📥 Download files (download mode)
- 📤 Upload files with drag & drop support
- ✅ Multi-select functionality
- 🎨 Customizable icon mapping
- 📱 Responsive design
- 🎯 TypeScript support
- 🎨 Element Plus integration
- 🔄 Drag and drop sorting (vuedraggable)
- ⚡ Upload event debouncing (lodash-es)

## 📦 Installation

```bash
npm install @leon/file-actions lodash-es vuedraggable
```

## 🚀 Quick Start

### Basic Usage

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
import '@leon/file-actions/dist/style.css'

const files = [
  { name: 'document.pdf', url: '/files/document.pdf' },
  { name: 'image.jpg', url: '/files/image.jpg' },
  { name: 'archive.zip', url: '/files/archive.zip' }
]

const handleFileClick = ({ file, index }) => {
  console.log('File clicked:', file, index)
}
</script>
```

### Global Registration

```javascript
import { createApp } from 'vue'
import { FileActions } from '@leon/file-actions'
import '@leon/file-actions/dist/style.css'

const app = createApp(App)
app.use(FileActions)
app.mount('#app')
```

## 📋 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `files` | `FileActionItem[]` | `[]` | Array of files to display |
| `mode` | `'view' \| 'edit' \| 'download'` | `'view'` | Component mode |
| `selectable` | `boolean` | `true` | Enable multi-select |
| `showUpload` | `boolean` | `true` | Show upload area |
| `iconMap` | `Record<string, string>` | `{}` | Custom icon mapping |
| `draggable` | `boolean` | `false` | Enable drag and drop sorting |
| `uploadDebounceDelay` | `number` | `300` | Upload event debounce delay (ms) |
| `virtual` | `boolean` | `false` | Enable virtual scrolling for large lists |
| `virtualItemHeight` | `number` | `60` | Height of each item in virtual list (px) |

### Virtual Scrolling Example

```vue
<template>
  <FileActions
    :files="files"
    :virtual="true"
    :virtual-item-height="60"
  />
</template>

<script setup>
import { FileActions } from '@leon/file-actions'
const files = Array.from({ length: 1000 }, (_, i) => ({ name: `file_${i}.txt`, url: `/files/file_${i}.txt` }))
</script>
```

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `delete` | `{ file: FileActionItem, index: number }` | File delete event |
| `download` | `{ file: FileActionItem, index: number }` | File download event |
| `upload-change` | `any[]` | Upload file list change (debounced) |
| `select-change` | `string[]` | Selected file URLs |
| `file-click` | `{ file: FileActionItem, index: number }` | File click event |
| `drag-end` | `{ oldIndex: number, newIndex: number, file: FileActionItem }` | Drag and drop end event |

### Types

```typescript
interface FileActionItem {
  name: string;
  url?: string;
  icon?: string;
  [key: string]: any;
}
```

## 🎯 Usage Examples

### Edit Mode (Delete & Upload)

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
  console.log('Upload files:', fileList)
}

const handleSelectChange = (selectedUrls) => {
  console.log('Selected files:', selectedUrls)
}
</script>
```

### Download Mode

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
  // Handle file download
  window.open(file.url, '_blank')
}
</script>
```

### Custom Icons

```vue
<template>
  <FileActions
    :files="files"
    :icon-map="customIcons"
  />
</template>

<script setup>
import { FileActions } from '@leon/file-actions'

const customIcons = {
  pdf: '/custom-icons/pdf-icon.svg',
  doc: '/custom-icons/word-icon.svg',
  xlsx: '/custom-icons/excel-icon.svg'
}
</script>
```

### Drag and Drop Sorting

```vue
<template>
  <FileActions
    :files="files"
    :draggable="true"
    @drag-end="handleDragEnd"
  />
</template>

<script setup>
import { ref } from 'vue'
import { FileActions } from '@leon/file-actions'

const files = ref([
  { name: 'document.pdf', url: '/files/document.pdf' },
  { name: 'image.jpg', url: '/files/image.jpg' },
  { name: 'archive.zip', url: '/files/archive.zip' }
])

const handleDragEnd = ({ oldIndex, newIndex, file }) => {
  console.log(`File ${file.name} moved from ${oldIndex} to ${newIndex}`)
  // Update your files array if needed
  const movedFile = files.value.splice(oldIndex, 1)[0]
  files.value.splice(newIndex, 0, movedFile)
}
</script>
```

### Upload Event Debouncing

```vue
<template>
  <FileActions
    :files="files"
    mode="edit"
    :upload-debounce-delay="500"
    @upload-change="handleUploadChange"
  />
</template>

<script setup>
import { FileActions } from '@leon/file-actions'

const handleUploadChange = (fileList) => {
  // This will be called with a 500ms debounce delay
  console.log('Upload files (debounced):', fileList)
}
</script>
```

## 🎨 Supported File Types

The component includes default icons for:
- PDF files (`.pdf`)
- Word documents (`.doc`, `.docx`)
- Text files (`.txt`)
- Images (`.jpg`, `.jpeg`, `.png`, `.gif`)
- Archives (`.zip`, `.rar`)
- Unknown files (fallback icon)

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run type-check

# Build for production
npm run build
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or issues, please [open an issue](https://github.com/your-username/file-actions/issues) on GitHub.
