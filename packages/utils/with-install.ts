import { Plugin } from 'vue';

export type SFCWithInstall<T> = T & Plugin;
export function withInstall<T>(comp: T) {
    (comp as SFCWithInstall<T>).install = function(app) {
        // 解构出名字
        const { name } = comp as unknown as { name:string };
        // 将组件注册成全局
        app.component(name, comp);
    }
    return comp as SFCWithInstall<T>;
}