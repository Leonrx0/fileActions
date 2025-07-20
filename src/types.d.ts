declare module '@leon/file-actions' {
  import { DefineComponent, PropType } from 'vue'

  export interface FileActionItem {
    name: string
    url?: string
    icon?: string
    [key: string]: any
  }

  export interface FileActionsProps {
    files?: FileActionItem[]
    mode?: 'view' | 'edit' | 'download'
    selectable?: boolean
    showUpload?: boolean
    iconMap?: Record<string, string>
    draggable?: boolean
    uploadDebounceDelay?: number
    virtual?: boolean
    virtualItemHeight?: number
  }

  export interface FileActionsEmits {
    delete: (payload: { file: FileActionItem; index: number }) => void
    download: (payload: { file: FileActionItem; index: number }) => void
    'upload-change': (payload: any[]) => void
    'select-change': (payload: string[]) => void
    'file-click': (payload: { file: FileActionItem; index: number }) => void
    'drag-end': (payload: { oldIndex: number; newIndex: number; file: FileActionItem }) => void
  }

  const FileActions: DefineComponent<FileActionsProps, {}, {}, {}, {}, {}, {}, FileActionsEmits>

  export { FileActions }

  export default FileActions
}

declare module '@leon/file-actions/dist/style.css' {
  const content: string
  export default content
} 