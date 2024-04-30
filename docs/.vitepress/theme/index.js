// 把组件可以全局使用
import DefaultTheme from 'vitepress/theme'

import ZIcon from '@wangxin/components/icon'
import '@wangxin/theme-chalk/src/index.scss'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.use(ZIcon) // 在 vitepress 中,注册全局组件
    },  
}