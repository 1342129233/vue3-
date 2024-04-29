// 用来整合组件的,最终实现导出组件

import _Icon from './src/icon.vue';
import { withInstall } from '@wangxin/utils/with-install';


const Icon = withInstall(_Icon);

export default Icon; // 可以通过 app.use来使用,也可以通过 import 单独引入

export * from './src/icon';

// 在这里添加的类型,可以在模版中被解析
declare module 'vue' {
    export interface GlobalComponents { // 我们的接口将会自动合并
        ZIcon: typeof Icon
    }
}
