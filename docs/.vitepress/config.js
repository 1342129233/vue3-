export default {
    // 站点级选项
    title: 'Z-UI',
    description: ' UI 库',
    themeConfig: {
        // 主题级选项
        lastUpdated: '最后更新时间',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: '编辑此网站',
        repo: 'https://gitee.com/login',
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright 2024-present'
        },
        nav: [
            { text: '指南', link: '/guide/installation', activeMatch: '/guide/'},
            { text: '组件', link: '/component/icon', activeMatch: '/component/'},
        ],
        sidebar: {
            '/guide/': [
                {
                    text: '指南',
                    items: [
                        { text: '安装', link: '/guide/installation' },
                        { text: '快速开始', link: '/guide/quieStart' }
                    ]
                }
            ],
            '/component/': [
                {
                    text: '基础组件',
                    items: [
                        { text: 'Icon', link: '/component/icon' }
                    ]
                }
            ]
        }
    }
}

