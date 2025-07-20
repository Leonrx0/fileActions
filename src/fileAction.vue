<template>
  <div class="file-actions-wrap">
    <virtual-list
      v-if="props.virtual"
      :data-key="'url'"
      :data-sources="draggableFiles"
      :keeps="15"
      :item-height="props.virtualItemHeight"
      class="file-icons"
    >
      <template #default="{ item: file, index: idx }">
        <div
          class="file-column"
          :class="{ selected: selectable && selected.includes(file.url || file.name) }"
          :title="file.name"
          @click="() => { toggleSelect(file); handleFileClick(file, idx); }"
        >
          <div class="file-icon-wrap-and-name">
            <div class="file-icon-wrap">
              <img :src="getFileIcon(file)" alt="file-icon" class="file-type-icon" />
              <img
                v-if="isEdit"
                src="/src/assets/icons/delete-x.svg"
                class="file-close-icon"
                @click.stop="handleDelete(file, idx)"
                alt="remove"
                title="删除文件"
              />
              <img
                v-else-if="isDownload"
                src="/src/assets/icons/download-1.svg"
                class="file-close-icon"
                @click.stop="handleDownload(file, idx)"
                alt="download"
                title="下载文件"
              />
            </div>
            <span class="file-name">{{ file.name }}</span>
          </div>
        </div>
      </template>
    </virtual-list>
    <draggable
      v-else
      v-model="draggableFiles"
      class="file-icons"
      :disabled="!draggable"
      item-key="url || name"
      @end="handleDragEnd"
    >
      <template #item="{ element: file, index: idx }">
        <div
          class="file-column"
          :class="{ selected: selectable && selected.includes(file.url || file.name) }"
          :title="file.name"
          @click="() => { toggleSelect(file); handleFileClick(file, idx); }"
        >
          <div class="file-icon-wrap-and-name">
            <div class="file-icon-wrap">
              <img :src="getFileIcon(file)" alt="file-icon" class="file-type-icon" />
              <img
                v-if="isEdit"
                src="/src/assets/icons/delete-x.svg"
                class="file-close-icon"
                @click.stop="handleDelete(file, idx)"
                alt="remove"
                title="删除文件"
              />
              <img
                v-else-if="isDownload"
                src="/src/assets/icons/download-1.svg"
                class="file-close-icon"
                @click.stop="handleDownload(file, idx)"
                alt="download"
                title="下载文件"
              />
            </div>
            <span class="file-name">{{ file.name }}</span>
          </div>
        </div>
      </template>
    </draggable>

    <div class="file-upload-box" v-if="showUpload && !isDownload">
      <el-upload
        class="upload-demo"
        drag
        multiple
        :show-file-list="true"
        :file-list="uploadFileList"
        @change="handleFileChange"
        :auto-upload="false"
      >
        <div class="upload-btn-content" tabindex="0" role="button" aria-label="点击或拖拽上传文件">
          <img
            src="/src/assets/icons/add-file.svg"
            alt="add"
            class="file-type-icon upload-btn-icon"
          />
          <span class="upload-btn-text">点击或拖拽上传文件</span>
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, PropType, watch } from 'vue';
import { debounce } from 'lodash-es';
import draggable from 'vuedraggable';
import VirtualList from 'vue3-virtual-scroll-list';

export interface FileActionItem {
  name: string;
  url?: string;
  icon?: string;
  [key: string]: any;
}

const props = defineProps({
  files: {
    type: Array as PropType<FileActionItem[]>,
    default: () => []
  },
  /** 'view' 仅查看; 'edit' 可删除上传; 'download' 显示下载按钮 */
  mode: {
    type: String as PropType<'view' | 'edit' | 'download'>,
    default: 'view'
  },
  /** 是否允许选择（多选删除/批量操作） */
  selectable: {
    type: Boolean,
    default: true
  },
  /** 是否显示上传区域（对外可自由控制） */
  showUpload: {
    type: Boolean,
    default: true
  },
  /** 图标映射：{ pdf: url, doc: url, ... } 可覆盖默认 */
  iconMap: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({})
  },
  /** 是否启用拖拽排序 */
  draggable: {
    type: Boolean,
    default: false
  },
  /** 上传事件防抖延迟时间（毫秒） */
  uploadDebounceDelay: {
    type: Number,
    default: 300
  },
  /** 是否启用虚拟滚动 */
  virtual: {
    type: Boolean,
    default: false
  },
  /** 虚拟列表每项高度 */
  virtualItemHeight: {
    type: Number,
    default: 60
  }
});

const emit = defineEmits<{
  (e: 'delete', payload: { file: FileActionItem; index: number }): void;
  (e: 'download', payload: { file: FileActionItem; index: number }): void;
  (e: 'upload-change', payload: any[]): void; // 原 ElementPlus fileList
  (e: 'select-change', payload: string[]): void; // 选中的 url 列表
  (e: 'file-click', payload: { file: FileActionItem; index: number }): void;
  (e: 'drag-end', payload: { oldIndex: number; newIndex: number; file: FileActionItem }): void;
}>();

const uploadFileList = ref<any[]>([]);
const selected = ref<string[]>([]);
const draggableFiles = ref<FileActionItem[]>([]);

// 监听 files 变化，同步到 draggableFiles
watch(() => props.files, (newFiles) => {
  draggableFiles.value = [...newFiles];
}, { immediate: true, deep: true });

const isEdit = computed(() => props.mode === 'edit');
const isDownload = computed(() => props.mode === 'download');

function toggleSelect(file: FileActionItem) {
  if (!props.selectable) return;
  const key = file.url ?? file.name;
  if (!key) return;
  const i = selected.value.indexOf(key);
  i === -1 ? selected.value.push(key) : selected.value.splice(i, 1);
  emit('select-change', [...selected.value]);
}

// 创建防抖的上传事件处理器
const debouncedUploadChange = debounce((fileList: any[]) => {
  emit('upload-change', fileList);
}, props.uploadDebounceDelay);

function handleFileChange(_file: any, fileList: any[]) {
  uploadFileList.value = fileList;
  debouncedUploadChange(fileList);
}

function handleDelete(file: FileActionItem, index: number) {
  emit('delete', { file, index });
}

function handleDownload(file: FileActionItem, index: number) {
  emit('download', { file, index });
}

function handleFileClick(file: FileActionItem, index: number) {
  emit('file-click', { file, index });
}

function handleDragEnd(evt: any) {
  const { oldIndex, newIndex } = evt;
  if (oldIndex !== newIndex && oldIndex !== undefined && newIndex !== undefined) {
    const file = draggableFiles.value[newIndex];
    emit('drag-end', { oldIndex, newIndex, file });
  }
}

//
// 内置默认图标（相对路径 / import.meta.glob 仅示意；发布库时可改为 esm import 或 require）
//
const defaultIcons = import.meta.glob('/src/assets/icons/*.svg', { eager: true, import: 'default' }) as Record<string, string>;

// 映射默认扩展
const defaultIconMap: Record<string, string> = {
  pdf: defaultIcons['/src/assets/icons/pdf.svg'] || '',
  doc: defaultIcons['/src/assets/icons/docx.svg'] || '',
  docx: defaultIcons['/src/assets/icons/docx.svg'] || '',
  txt: defaultIcons['/src/assets/icons/txt.svg'] || '',
  jpg: defaultIcons['/src/assets/icons/jpg.svg'] || '',
  jpeg: defaultIcons['/src/assets/icons/jpg.svg'] || '',
  png: defaultIcons['/src/assets/icons/jpg.svg'] || '',
  gif: defaultIcons['/src/assets/icons/jpg.svg'] || '',
  zip: defaultIcons['/src/assets/icons/zip.svg'] || '',
  rar: defaultIcons['/src/assets/icons/zip.svg'] || '',
  other: defaultIcons['/src/assets/icons/unknownfile.svg'] || ''
};

function getFileIcon(file: FileActionItem) {
  const ext = (file.name || file.url || '').split('.').pop()?.toLowerCase() || 'other';
  return file.icon || props.iconMap[ext] || defaultIconMap[ext] || defaultIconMap.other;
}
</script>


<style scoped>
.file-actions-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.file-icons {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 16px;
  min-height: 120px;
}

/* 拖拽时的样式 */
.file-icons.sortable-ghost .file-column {
  opacity: 0.5;
  transform: scale(0.95);
}

.file-icons.sortable-chosen .file-column {
  cursor: grabbing;
}

.file-icons.sortable-drag .file-column {
  cursor: grabbing;
  transform: rotate(5deg) scale(1.05);
  z-index: 1000;
}

.file-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 80px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: transparent;
}

.file-column.selected {
  background-color: #fff;
}

.file-icon-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.file-column:hover .file-icon-wrap {
  transform: translateY(-8px) scale(1.1);
}

.file-column.selected .file-icon-wrap {
  transform: translateY(-8px) scale(1.2);
}

.file-type-icon {
  width: 40px;
  height: 40px;
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.file-column:hover .file-type-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.file-column.selected .file-type-icon {
  filter: drop-shadow(0 3px 6px rgba(64, 158, 255, 0.3));
}

.file-close-icon {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.25s ease;
  z-index: 10;
  user-select: none;
}
.file-column:hover .file-close-icon,
.file-column.selected .file-close-icon {
  opacity: 1;
}
.file-close-icon:hover {
  transform: scale(1.3);
  filter: brightness(0.7);
}

.file-icon-wrap-and-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.file-name {
  max-width: 80px;
  font-size: 12px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  user-select: none;
  line-height: 1.2;
  margin: 0;
}

.file-upload-box {
  width: 100%;
  border-radius: 6px;
  background-color: #fafafa;
  padding: 20px;
  box-sizing: border-box;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}
.file-upload-box:hover {
  border-color: #409EFF;
  background-color: #fafafa;
}

.upload-btn-content {
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  outline: none;
  color: #888;
  transition: color 0.3s ease;
}
.upload-btn-content:hover,
.upload-btn-content:focus {
  color: #409EFF;
}
.upload-btn-icon {
  width: 42px;
  height: 42px;
  transition: transform 0.3s ease;
}
.upload-btn-content:hover .upload-btn-icon,
.upload-btn-content:focus .upload-btn-icon {
  transform: scale(1.2);
}
</style>
