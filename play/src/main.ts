import { createApp } from 'vue'
import App from './App.vue'

import Icon from '@wangxin/components/icon';
import '@wangxin/theme-chalk/src/index.scss'

const plugins = [
    Icon
]


const app = createApp(App)
plugins.forEach(plugin => app.use(plugin)); // 将组件注册成全局组件,可以直接使用

app.mount('#app')
