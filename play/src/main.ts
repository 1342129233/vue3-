import { createApp } from 'vue'
import router from "./router";
import App from './App.vue'

import Icon from '@wangxin/components/icon';
import '@wangxin/theme-chalk/src/index.scss';
import Tree from '@wangxin/components/tree';
import Checkbox from '@wangxin/components/checkbox';

const plugins = [
    Icon,
    Tree,
    Checkbox
]


const app = createApp(App)
plugins.forEach(plugin => app.use(plugin)); // 将组件注册成全局组件,可以直接使用

app.use(router)
app.mount('#app')
