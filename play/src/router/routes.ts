export default [
    {
        name: 'home',
        path: '/home',
        icon: '', //  侧边栏icon组件
        title: '首页', //  侧边栏title
        component: () => import('@/views/home/index.vue')
    },
    {
        name: 'z-icon',
        path: '/z-icon',
        icon: '',
        title: 'Icon图标',
        component: () => import('@/views/z-icon/index.vue')
    },
    {
        name: 'z-tree',
        path: '/z-tree',
        icon: '',
        title: 'Tree图标',
        component: () => import('@/views/z-tree/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/home'
    }
]