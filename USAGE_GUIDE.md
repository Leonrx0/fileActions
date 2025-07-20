# Vue File Actions - Usage Guide

## Overview

Vue File Actions is a comprehensive Vue 3 component for file management with support for viewing, editing, downloading, uploading, and organizing files with drag-and-drop functionality.

## Basic Setup

### Installation

```bash
npm install @leon/file-actions lodash-es vuedraggable
```

### Import and Use

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
  { name: 'image.jpg', url: '/files/image.jpg' }
]

const handleFileClick = ({ file, index }) => {
  console.log('File clicked:', file, index)
}
</script>
```

## Component Modes

### 1. View Mode (Default)
Display files in read-only mode with click events.

```vue
<FileActions
  :files="files"
  mode="view"
  @file-click="handleFileClick"
/>
```

### 2. Edit Mode
Enable file deletion and upload functionality.

```vue
<FileActions
  :files="files"
  mode="edit"
  :show-upload="true"
  @delete="handleDelete"
  @upload-change="handleUploadChange"
/>
```

### 3. Download Mode
Show download buttons for each file.

```vue
<FileActions
  :files="files"
  mode="download"
  @download="handleDownload"
/>
```

## Advanced Features

### Drag and Drop Sorting

Enable drag-and-drop reordering of files:

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
  
  // Update the files array to reflect the new order
  const movedFile = files.value.splice(oldIndex, 1)[0]
  files.value.splice(newIndex, 0, movedFile)
}
</script>
```

**Features:**
- Visual feedback during drag operations
- Smooth animations
- Disabled state support
- Event emission with old and new indices

### Upload Event Debouncing

Prevent excessive API calls during file uploads:

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
  // This function will only be called after 500ms of inactivity
  console.log('Upload files (debounced):', fileList)
  
  // Process the file list
  fileList.forEach(file => {
    // Handle each file
    console.log('Processing file:', file.name)
  })
}
</script>
```

**Benefits:**
- Reduces server load during rapid file selection
- Improves performance for large file lists
- Configurable delay (default: 300ms)
- Uses lodash-es debounce for reliability

## Multi-Select Functionality

Enable multi-select for batch operations:

```vue
<template>
  <FileActions
    :files="files"
    :selectable="true"
    @select-change="handleSelectChange"
  />
  
  <div v-if="selectedFiles.length > 0">
    <button @click="deleteSelected">Delete Selected ({{ selectedFiles.length }})</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FileActions } from '@leon/file-actions'

const files = ref([...])
const selectedFiles = ref([])

const handleSelectChange = (selectedUrls) => {
  selectedFiles.value = selectedUrls
  console.log('Selected files:', selectedUrls)
}

const deleteSelected = () => {
  // Delete all selected files
  selectedFiles.value.forEach(url => {
    const index = files.value.findIndex(f => f.url === url)
    if (index > -1) {
      files.value.splice(index, 0)
    }
  })
  selectedFiles.value = []
}
</script>
```

## Custom Icons

Override default file type icons:

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
  pdf: '/icons/custom-pdf.svg',
  doc: '/icons/custom-word.svg',
  docx: '/icons/custom-word.svg',
  xlsx: '/icons/custom-excel.svg',
  pptx: '/icons/custom-powerpoint.svg'
}
</script>
```

## Event Handling

### Complete Event Example

```vue
<template>
  <FileActions
    :files="files"
    mode="edit"
    :draggable="true"
    :selectable="true"
    :show-upload="true"
    :upload-debounce-delay="300"
    @delete="handleDelete"
    @download="handleDownload"
    @upload-change="handleUploadChange"
    @select-change="handleSelectChange"
    @file-click="handleFileClick"
    @drag-end="handleDragEnd"
  />
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { FileActions } from '@leon/file-actions'

const files = ref([...])

// Delete event
const handleDelete = ({ file, index }) => {
  ElMessage.success(`Deleted: ${file.name}`)
  files.value.splice(index, 1)
}

// Download event
const handleDownload = ({ file, index }) => {
  ElMessage.info(`Downloading: ${file.name}`)
  window.open(file.url, '_blank')
}

// Upload change (debounced)
const handleUploadChange = (fileList) => {
  ElMessage.success(`Selected ${fileList.length} files`)
  console.log('Upload files:', fileList)
}

// Selection change
const handleSelectChange = (selectedUrls) => {
  console.log('Selected:', selectedUrls)
}

// File click
const handleFileClick = ({ file, index }) => {
  ElMessage.info(`Clicked: ${file.name}`)
}

// Drag end
const handleDragEnd = ({ oldIndex, newIndex, file }) => {
  ElMessage.success(`Moved ${file.name} to position ${newIndex}`)
  
  // Update array order
  const movedFile = files.value.splice(oldIndex, 1)[0]
  files.value.splice(newIndex, 0, movedFile)
}
</script>
```

## 虚拟滚动（Virtual List）

当文件数量较多时，建议开启虚拟滚动以提升性能：

```vue
<FileActions
  :files="files"
  :virtual="true"
  :virtual-item-height="60"
/>
```

- `virtual`: 是否启用虚拟滚动，默认 false。
- `virtualItemHeight`: 虚拟列表每项高度（单位 px），默认 60。

适合 100+ 文件场景，极大提升渲染效率。

## Styling and Customization

### Custom CSS Variables

```css
:root {
  --file-actions-gap: 24px;
  --file-actions-icon-size: 40px;
  --file-actions-border-radius: 8px;
  --file-actions-hover-scale: 1.1;
  --file-actions-selected-bg: #fff;
  --file-actions-upload-bg: #fafafa;
}
```

### Responsive Design

The component is fully responsive and works on:
- Desktop (default layout)
- Tablet (adjusted spacing)
- Mobile (stacked layout)

## Performance Tips

1. **Use debouncing for upload events** to prevent excessive API calls
2. **Limit file list size** for better performance (recommend < 100 files)
3. **Use virtual scrolling** for very large lists (implement separately)
4. **Optimize images** for custom icons (SVG recommended)

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Troubleshooting

### Common Issues

1. **Drag and drop not working**
   - Ensure `draggable` prop is set to `true`
   - Check that vuedraggable is properly installed

2. **Upload events firing too frequently**
   - Increase `uploadDebounceDelay` value
   - Check that lodash-es is installed

3. **Icons not displaying**
   - Verify icon URLs are accessible
   - Check file extension mapping

4. **TypeScript errors**
   - Ensure types are properly imported
   - Check prop types match expected interfaces 