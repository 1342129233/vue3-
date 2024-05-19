import { withInstall } from '@wangxin/utils/with-install';
import _Virtual from './src/virtual.tsx';

const Virtual = withInstall(_Virtual);

export default Virtual;

// 在这里添加的类型,可以在模版中被解析
declare module 'vue' {
    export interface GlobalComponents { // 我们的接口将会自动合并
        ZVirtualList: typeof Virtual
    }
}

export * from './src/virtual.tsx';
