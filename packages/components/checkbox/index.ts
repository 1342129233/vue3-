import { withInstall } from '@wangxin/utils/with-install';
import _Checkbox from './src/checkbox.vue';

const Checkbox = withInstall(_Checkbox);

export default Checkbox;

// 在这里添加的类型,可以在模版中被解析
declare module 'vue' {
    export interface GlobalComponents { // 我们的接口将会自动合并
        ZCheckbox: typeof Checkbox
    }
}

export * from './src/checkbox';
