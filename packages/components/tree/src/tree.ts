// vue组件的props

import { ExtractPropTypes, InjectionKey, PropType, SetupContext } from 'vue';

export type Key = string | number;

export interface TreeNode extends Required<TreeOption> {
    level: number
    rawNode: TreeOption
    children: TreeNode[]
    isLeaf: boolean
}

export interface TreeOption {
    label?: Key
    key?: Key
    children?: TreeOption[]
    isLeaf?: boolean
    disabled?: boolean
    [key: string]: unknown // 任意的接口
}

export const treeProps = {
    // props 是仅读的
    data: {
        type: Array as PropType<TreeOption[]>,
        default: () => []
    },
    defaultExpandedKeys: { // 默认展开
        type: Array as PropType<Array<Key>>,
        default: () => []
    },
    defaultCheckedKeys: { // 默认选中的节点
        type: Array as PropType<Array<Key>>,
        default: () => []
    },
    label: {
        type: String,
        default: 'label'
    },
    nodeKey: {
        type: String,
        default: 'key'
    },
    children: {
        type: String,
        default: 'children'
    },
    selectedKeys: {
        type: Array as PropType<Array<Key>>,
        default: () => []
    },
    selectable: {
        type: Boolean,
        default: true
    },
    multiple: {
        type: Boolean,
        default: false
    },
    onLoad: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>
}

export const treeNodeProps = {
    node: {
        type: Object as PropType<TreeNode>,
        required: true
    },
    expanded: {
        type: Boolean,
        required: true
    },
    loadingKeys: {
        type: Object as PropType<Set<Key>>,
        required: true
    },
    selectKeys: {
        type: Array as PropType<Array<Key>>,
        default: () => []
    }
} as const;

export const treeNodeEmitts = {
    toggle: (node: TreeNode) => node,
    select: (node: TreeNode) => node
}
export const treeEmits = { // 内部发射的事件,用来同步响应式数据
    'update:selectedKeys': (keys: Key[]) => keys
}

export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>;
export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>;

export interface TreeContext {
    slots: SetupContext['slots'],
}

// 此变量作为提供出去的属性
export const treeInjectKey: InjectionKey<TreeContext> = Symbol()

export const ZTreeNodeContentProps = {
    node: {
        type: Object as PropType<TreeNode>,
        require: true
    }
}