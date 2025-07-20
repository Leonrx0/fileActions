import type { App } from 'vue';
import FileActions from './fileAction.vue';
export { FileActions };
export interface FileActionItem {
    name: string;
    url?: string;
    icon?: string;
    [key: string]: any;
}
export default FileActions;
export declare const install: (app: App) => void;
declare const plugin: {
    install: (app: App) => void;
};
export { plugin };
