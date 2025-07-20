import { PropType } from 'vue';
export interface FileActionItem {
    name: string;
    url?: string;
    icon?: string;
    [key: string]: any;
}
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    files: {
        type: PropType<FileActionItem[]>;
        default: () => never[];
    };
    /** 'view' 仅查看; 'edit' 可删除上传; 'download' 显示下载按钮 */
    mode: {
        type: PropType<"view" | "edit" | "download">;
        default: string;
    };
    /** 是否允许选择（多选删除/批量操作） */
    selectable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 是否显示上传区域（对外可自由控制） */
    showUpload: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 图标映射：{ pdf: url, doc: url, ... } 可覆盖默认 */
    iconMap: {
        type: PropType<Record<string, string>>;
        default: () => {};
    };
    /** 是否启用拖拽排序 */
    draggable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 上传事件防抖延迟时间（毫秒） */
    uploadDebounceDelay: {
        type: NumberConstructor;
        default: number;
    };
    /** 是否启用虚拟滚动 */
    virtual: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 虚拟列表每项高度 */
    virtualItemHeight: {
        type: NumberConstructor;
        default: number;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    download: (payload: {
        file: FileActionItem;
        index: number;
    }) => any;
    delete: (payload: {
        file: FileActionItem;
        index: number;
    }) => any;
    "upload-change": (payload: any[]) => any;
    "select-change": (payload: string[]) => any;
    "file-click": (payload: {
        file: FileActionItem;
        index: number;
    }) => any;
    "drag-end": (payload: {
        oldIndex: number;
        newIndex: number;
        file: FileActionItem;
    }) => any;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    files: {
        type: PropType<FileActionItem[]>;
        default: () => never[];
    };
    /** 'view' 仅查看; 'edit' 可删除上传; 'download' 显示下载按钮 */
    mode: {
        type: PropType<"view" | "edit" | "download">;
        default: string;
    };
    /** 是否允许选择（多选删除/批量操作） */
    selectable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 是否显示上传区域（对外可自由控制） */
    showUpload: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 图标映射：{ pdf: url, doc: url, ... } 可覆盖默认 */
    iconMap: {
        type: PropType<Record<string, string>>;
        default: () => {};
    };
    /** 是否启用拖拽排序 */
    draggable: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 上传事件防抖延迟时间（毫秒） */
    uploadDebounceDelay: {
        type: NumberConstructor;
        default: number;
    };
    /** 是否启用虚拟滚动 */
    virtual: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** 虚拟列表每项高度 */
    virtualItemHeight: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{
    onDownload?: ((payload: {
        file: FileActionItem;
        index: number;
    }) => any) | undefined;
    onDelete?: ((payload: {
        file: FileActionItem;
        index: number;
    }) => any) | undefined;
    "onUpload-change"?: ((payload: any[]) => any) | undefined;
    "onSelect-change"?: ((payload: string[]) => any) | undefined;
    "onFile-click"?: ((payload: {
        file: FileActionItem;
        index: number;
    }) => any) | undefined;
    "onDrag-end"?: ((payload: {
        oldIndex: number;
        newIndex: number;
        file: FileActionItem;
    }) => any) | undefined;
}>, {
    files: FileActionItem[];
    mode: "view" | "edit" | "download";
    selectable: boolean;
    showUpload: boolean;
    iconMap: Record<string, string>;
    draggable: boolean;
    uploadDebounceDelay: number;
    virtual: boolean;
    virtualItemHeight: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
