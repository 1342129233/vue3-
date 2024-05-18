<template>
    <div :class="bem.b()">
        <ZTreeNode 
            v-for="node in flattenTree" 
            :key="node.key"
            :node="node"
            :expanded="isExpanded(node)"
            @toggle="toggleExpand"
        >
        </ZTreeNode>
    </div> 
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { createNameSpace } from '@wangxin/utils/create';
import { treeProps, TreeProps, TreeOption, TreeNode } from './tree';
import ZTreeNode from './treeNode.vue';

const bem = createNameSpace('tree');
defineOptions({
    name: 'z-tree'
})

const props = defineProps(treeProps);

// 有了 props 要对用户的数据进行格式化,格式化一个固定的结果
// label key children

// 我们将 props.data 格式化后放到 tree 中
const tree = ref<TreeNode[]>([]);

function createOptions(key: string, label: string, children: string) {
    return {
        getKey(node: TreeOption) {
            return node[key] as string
        },
        getLabel(node: TreeOption) {
            return node[label] as string
        },
        getChildren(node: TreeOption) {
            return node[children] as TreeOption[]
        }
    }
}
const treeOptions = createOptions(props.nodeKey, props.label, props.children);

function createTree(data: TreeOption[]): TreeNode[] {
    function traversal(data: TreeOption[], parent: TreeNode | null = null): TreeNode[] {
        
        return data.map((node: TreeOption) => {
            const children = treeOptions.getChildren(node) || [];
            const treeNode: TreeNode = {
                key: treeOptions.getKey(node),
                label: treeOptions.getLabel(node),
                children: [], // 默认为空
                rawNode: node,
                level: parent ? parent.level + 1 : 0,
                // 判断阶段是否自带 isLeaf 如果自带了,以自带的为准,如果没有自带的则看一下有没有 children
                isLeaf: node.isLeaf ?? children.length == 0
            }

            if(children.length > 0) {
                // 有子元素再去递归
                treeNode.children = traversal(children, treeNode);
            }
 
            return treeNode;
        })
    }
    const result: TreeNode[] = traversal(data);
    return result;
}

// 监控数据变化,调用格式化方法,上来先格式化一次
watch(
    () => props.data, 
    (data: TreeOption[]) => {
        tree.value = createTree(data);
        console.log(tree.value)
    },
    {
        immediate: true
    }
)

/**
 * 虚拟列表需要知道你有多少层，需要拍平,拍平之后还需要能展开
 * 还需要默认哪些是展开的
 */

// 需要展开的 key 有哪些
const expandedKeysSet = ref(new Set(props.defaultExpandedKeys));

// 拍平(虚拟列表要展示多少层)
const flattenTree = computed(() => {
    // 要展开的 keys 有哪些
    const expandedKeys = expandedKeysSet.value;

    // 这个就是拍平后的结果
    const flattenNodes: TreeNode[] = [];

    // 所有的数据和展开的 key 算出需要展开哪些
    const nodes = tree.value || [];
    // 用栈去处理,这是需要遍历的栈
    const stack: TreeNode[] = [];

    for(let i = nodes.length - 1; i >= 0; --i) {
        stack.push(nodes[i])
    }

    while (stack.length) {
        const node: TreeNode = stack.pop() as TreeNode;

        if(!node) continue;
        flattenNodes.push(node);
        // 判断是否展开
        if(expandedKeys.has(node.key)) {
            // 拿到子元素
            const children = node.children;
            if(children) {
                for(let i = node.children.length - 1; i >= 0; --i) {
                    stack.push(node.children[i])
                }
            }
        }
    }

    return flattenNodes;
})
console.log(flattenTree.value);

// 是不是展开
function isExpanded(node: TreeNode): boolean {
    return expandedKeysSet.value.has(node.key);
}

// 折叠
function collpase(node: TreeNode) {
    expandedKeysSet.value.delete(node.key);
}
// 展开
function expand(node: TreeNode) {
    expandedKeysSet.value.add(node.key);
}
// 切换(展开/关闭)
function toggleExpand(node: TreeNode) {
    const expandKeys = expandedKeysSet.value;
    if(expandKeys.has(node.key)) {
        collpase(node)
    } else {
        expand(node);
    }
}
</script>

