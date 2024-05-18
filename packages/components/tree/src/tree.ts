// vue组件的props

import { ExtractPropTypes, PropType } from 'vue';

type Key = string | number;

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
    }
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
} as const;

export const treeNodeEmitts = {
    toggle: (node: TreeNode) => node
}

export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>;
export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>;

