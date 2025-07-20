<template>
  <div class="demo-app">
    <div class="demo-header">
      <h1>Vue File Actions Demo</h1>
      <p>A comprehensive demo of the FileActions component</p>
    </div>

    <!-- 模式切换 -->
    <el-card class="demo-section">
      <template #header>
        <div class="section-header">
          <span>🎛️ 模式切换</span>
        </div>
      </template>
      
      <el-radio-group v-model="currentMode" class="mode-switcher">
        <el-radio-button 
          v-for="mode in ['view', 'edit', 'download']" 
          :key="mode" 
          :label="mode"
        >
          {{ modeLabels[mode] }}
        </el-radio-button>
      </el-radio-group>
    </el-card>

    <!-- 组件演示区域 -->
    <el-card class="demo-section">
      <template #header>
        <div class="section-header">
          <span>🎯 {{ modeLabels[currentMode] }} 演示</span>
        </div>
      </template>
      
      <FileActions
        :files="files"
        :mode="currentMode"
        :selectable="true"
        :show-upload="currentMode === 'edit'"
        :draggable="config.draggable"
        :upload-debounce-delay="config.uploadDebounceDelay"
        :virtual="config.virtual"
        :virtual-item-height="config.virtualItemHeight"
        @delete="handleDelete"
        @download="handleDownload"
        @upload-change="handleUploadChange"
        @select-change="handleSelectChange"
        @file-click="handleFileClick"
        @drag-end="handleDragEnd"
      />
    </el-card>

    <!-- 统计信息 -->
    <el-card class="demo-section">
      <template #header>
        <div class="section-header">
          <span>📊 统计信息</span>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="6">
          <el-statistic title="文件总数" :value="files.length" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="已选择" :value="selectedFiles.length" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="事件记录" :value="logs.length" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="当前模式" :value="currentMode" />
        </el-col>
      </el-row>
    </el-card>

    <!-- 当前文件列表 -->
    <el-card class="demo-section">
      <template #header>
        <div class="section-header">
          <span>📁 文件列表</span>
        </div>
      </template>
      
      <el-table :data="files" style="width: 100%">
        <el-table-column prop="name" label="文件名" />
        <el-table-column prop="url" label="文件路径" />
        <el-table-column label="操作" width="200">
          <template #default="{ row, $index }">
            <el-button 
              size="small" 
              @click="handleFileClick({ file: row, index: $index })"
            >
              查看
            </el-button>
            <el-button 
              v-if="currentMode === 'edit'"
              size="small" 
              type="danger" 
              @click="handleDelete({ file: row, index: $index })"
            >
              删除
            </el-button>
            <el-button 
              v-if="currentMode === 'download'"
              size="small" 
              type="primary" 
              @click="handleDownload({ file: row, index: $index })"
            >
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-empty v-if="files.length === 0" description="暂无文件" />
    </el-card>

    <!-- 操作按钮 -->
    <el-card class="demo-section">
      <template #header>
        <div class="section-header">
          <span>⚡ 操作按钮</span>
        </div>
      </template>
      
      <el-space wrap>
        <el-button type="success" @click="addRandomFile">
          ➕ 添加随机文件
        </el-button>
        <el-button type="warning" @click="resetFiles">
          🔄 重置文件列表
        </el-button>
        <el-button type="danger" @click="clearAll">
          🗑️ 清空所有
        </el-button>
        <el-button type="info" @click="logs = []">
          📝 清空日志
        </el-button>
      </el-space>
    </el-card>

    <!-- 事件日志 -->
    <el-card class="demo-section">
      <template #header>
        <div class="section-header">
          <span>📝 事件日志</span>
        </div>
      </template>
      
      <div class="log-container">
        <div v-for="(log, index) in logs" :key="index" class="log-item">
          <el-tag size="small" type="info">{{ log.time }}</el-tag>
          <span class="log-message">{{ log.message }}</span>
        </div>
        <el-empty v-if="logs.length === 0" description="暂无事件记录" />
      </div>
    </el-card>

    <!-- 配置面板 -->
    <el-card class="demo-section">
      <template #header>
        <div class="section-header">
          <span>⚙️ 配置面板</span>
        </div>
      </template>
      
      <el-form :model="config" label-width="120px">
        <el-form-item label="可选择">
          <el-switch v-model="config.selectable" />
        </el-form-item>
        <el-form-item label="显示上传">
          <el-switch v-model="config.showUpload" />
        </el-form-item>
        <el-form-item label="自定义图标">
          <el-input 
            v-model="config.customIcon" 
            placeholder="输入图标URL"
            @change="updateIconMap"
          />
        </el-form-item>
        <el-form-item label="拖拽排序">
          <el-switch v-model="config.draggable" />
        </el-form-item>
        <el-form-item label="上传防抖延迟">
          <el-input-number 
            v-model="config.uploadDebounceDelay" 
            :min="100" 
            :max="2000" 
            :step="100"
            placeholder="毫秒"
          />
        </el-form-item>
        <el-form-item label="虚拟滚动">
          <el-switch v-model="config.virtual" />
        </el-form-item>
        <el-form-item label="虚拟项高度">
          <el-input-number v-model="config.virtualItemHeight" :min="30" :max="200" :step="10" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FileActions } from '../dist/file-actions.es.js'

// 模拟文件数据
const mockFiles = [
  { name: '项目文档.pdf', url: '/files/document.pdf' },
  { name: '产品设计图.jpg', url: '/files/design.jpg' },
  { name: '代码压缩包.zip', url: '/files/code.zip' },
  { name: '会议记录.txt', url: '/files/meeting.txt' },
  { name: '财务报表.xlsx', url: '/files/finance.xlsx' },
  { name: '演示文稿.pptx', url: '/files/presentation.pptx' }
]

// 随机文件类型
const fileTypes = [
  { name: '文档', extensions: ['pdf', 'doc', 'docx', 'txt'] },
  { name: '图片', extensions: ['jpg', 'jpeg', 'png', 'gif'] },
  { name: '压缩包', extensions: ['zip', 'rar', '7z'] },
  { name: '表格', extensions: ['xlsx', 'xls', 'csv'] },
  { name: '演示', extensions: ['pptx', 'ppt'] }
]

// 响应式数据
const currentMode = ref('view')
const files = ref([...mockFiles])
const logs = ref([])
const selectedFiles = ref([])
const iconMap = ref({})

// 配置
const config = reactive({
  selectable: true,
  showUpload: true,
  customIcon: '',
  draggable: false,
  uploadDebounceDelay: 300,
  virtual: false,
  virtualItemHeight: 60
})

const modeLabels = {
  view: '查看模式',
  edit: '编辑模式',
  download: '下载模式'
}

// 添加日志
const addLog = (message: string) => {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift({ time, message })
  if (logs.value.length > 100) {
    logs.value = logs.value.slice(0, 100)
  }
}

// 生成随机文件名
const generateRandomFile = () => {
  const type = fileTypes[Math.floor(Math.random() * fileTypes.length)]
  const ext = type.extensions[Math.floor(Math.random() * type.extensions.length)]
  const names = ['项目', '产品', '设计', '代码', '文档', '报告', '方案', '计划', '总结', '分析']
  const name = names[Math.floor(Math.random() * names.length)]
  return {
    name: `${name}文件.${ext}`,
    url: `/files/${name.toLowerCase()}.${ext}`
  }
}

// 更新图标映射
const updateIconMap = () => {
  if (config.customIcon) {
    iconMap.value = {
      pdf: config.customIcon
    }
    addLog(`🎨 更新自定义图标: ${config.customIcon}`)
  } else {
    iconMap.value = {}
    addLog('🎨 清除自定义图标')
  }
}

// 事件处理函数
const handleDelete = async ({ file, index }: { file: any; index: number }) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文件 "${file.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    addLog(`🗑️ 删除文件: ${file.name} (索引: ${index})`)
    files.value.splice(index, 1)
    ElMessage.success(`已删除文件: ${file.name}`)
  } catch {
    ElMessage.info('取消删除')
  }
}

const handleDownload = ({ file, index }: { file: any; index: number }) => {
  addLog(`📥 下载文件: ${file.name} (索引: ${index})`)
  // 模拟下载
  const link = document.createElement('a')
  link.href = file.url || '#'
  link.download = file.name
  link.click()
  ElMessage.success(`开始下载: ${file.name}`)
}

const handleUploadChange = (fileList: any[]) => {
  addLog(`📤 上传文件变更: ${fileList.length} 个文件`)
  console.log('上传文件列表:', fileList)
  ElMessage.info(`选择了 ${fileList.length} 个文件`)
}

const handleSelectChange = (selectedUrls: string[]) => {
  addLog(`✅ 选择变更: ${selectedUrls.length} 个文件被选中`)
  selectedFiles.value = selectedUrls
  console.log('选中的文件:', selectedUrls)
}

const handleFileClick = ({ file, index }: { file: any; index: number }) => {
  addLog(`👆 点击文件: ${file.name} (索引: ${index})`)
  ElMessage.info(`点击了文件: ${file.name}`)
}

const handleDragEnd = ({ oldIndex, newIndex, file }: { oldIndex: number; newIndex: number; file: any }) => {
  addLog(`🔄 拖拽排序: ${file.name} 从位置 ${oldIndex} 移动到位置 ${newIndex}`)
  ElMessage.success(`文件 ${file.name} 已重新排序`)
}

// 操作函数
const addRandomFile = () => {
  const newFile = generateRandomFile()
  files.value.push(newFile)
  addLog(`➕ 添加文件: ${newFile.name}`)
  ElMessage.success(`添加了文件: ${newFile.name}`)
}

const resetFiles = () => {
  files.value = [...mockFiles]
  addLog('🔄 重置文件列表')
  ElMessage.success('文件列表已重置')
}

const clearAll = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有数据吗？此操作不可恢复。',
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    files.value = []
    logs.value = []
    selectedFiles.value = []
    addLog('🗑️ 清空所有数据')
    ElMessage.success('所有数据已清空')
  } catch {
    ElMessage.info('取消清空')
  }
}
</script>

<style scoped>
.demo-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-header {
  text-align: center;
  margin-bottom: 30px;
}

.demo-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.demo-header p {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.demo-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.mode-switcher {
  margin-bottom: 10px;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  padding: 15px;
  background: #f8f9fa;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #e9ecef;
}

.log-item:last-child {
  border-bottom: none;
}

.log-message {
  color: #2c3e50;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}
</style> 