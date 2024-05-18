import { withInstall } from '@wangxin/utils/with-install';
import _Tree from './src/tree.vue';

const Tree = withInstall(_Tree);

export default Tree;

// 在这里添加的类型,可以在模版中被解析
declare module 'vue' {
    export interface GlobalComponents { // 我们的接口将会自动合并
        ZTree: typeof Tree
    }
}
