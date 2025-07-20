import type { App } from 'vue';
import FileActions from './fileAction.vue';

// 导出组件
export { FileActions };

// 导出类型接口
export interface FileActionItem {
  name: string;
  url?: string;
  icon?: string;
  [key: string]: any;
}

// 默认导出
export default FileActions;

// Vue 插件安装函数
export const install = (app: App) => {
  app.component('FileActions', FileActions);
};

// 插件对象
const plugin = {
  install
};

export { plugin };
