<template>
    <div :class="bem.b()">
        <z-virtual-list :items="flattenTree" :remain="8" :size="35">
            <template #default="{ node }">
                <ZTreeNode
                    :key="node.key"
                    :node="node"
                    :expanded="isExpanded(node)"
                    :loading-keys="loadingKeysRef"
                    :select-keys="selectKeysRef"
                    :show-checkbox="showCheckbox"
                    :checked="isChecked(node)"
                    :disabled="isDisabled(node)"
                    :indeterminate="isIndeterminate(node)"
                    @select="handleSelect"
                    @toggle="toggleExpand"
                    @check="toggleCheck"
                >
                </ZTreeNode>
            </template>
        </z-virtual-list>
    </div> 
</template>

<script setup lang="ts">
import { ref, watch, computed, provide, useSlots, onMounted } from 'vue';
import { createNameSpace } from '@wangxin/utils/create';
import { treeProps, TreeProps, TreeOption, TreeNode, Key, treeEmits, treeInjectKey } from './tree';
import ZTreeNode from './treeNode.vue';
import ZVirtualList from '@wangxin/components/virtual-list';
 
const bem = createNameSpace('tree');
defineOptions({
    name: 'z-tree'
})

const props = defineProps(treeProps);

// 有了 props 要对用户的数据进行格式化,格式化一个固定的结果
// label key children

// 1) 我们将 props.data 格式化后放到 tree 中
const tree = ref<TreeNode[]>([]);

// 用来获取对应的字段
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

// 2) 将用户传递的数据进行格式化操作
function createTree(data: TreeOption[], parent: TreeNode | null = null): TreeNode[] {
    function traversal(data: TreeOption[], parent: TreeNode | null = null): TreeNode[] {
        
        return data.map((node: TreeOption) => {
            const children = treeOptions.getChildren(node) || [];
            const treeNode: TreeNode = {
                key: treeOptions.getKey(node),
                label: treeOptions.getLabel(node),
                children: [], // 默认为空
                rawNode: node,
                level: parent ? parent.level + 1 : 0,
                disabled: !!node.disabled,
                // 判断阶段是否自带 isLeaf 如果自带了,以自带的为准,如果没有自带的则看一下有没有 children
                isLeaf: node.isLeaf ?? children.length == 0,
                parentKey: parent?.key
            }

            if(children.length > 0) {
                // 有子元素再去递归, 将其格式化成 treeNode 类型
                treeNode.children = traversal(children, treeNode);
            }
 
            return treeNode;
        })
    }
    const result: TreeNode[] = traversal(data, parent);
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

// 3) 将树拍平(虚拟列表要展示多少层)(这里需要依赖,当前展开的节点,动态的计算)
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

// 是不是展开
function isExpanded(node: TreeNode): boolean {
    return expandedKeysSet.value.has(node.key);
}

// 折叠
function collpase(node: TreeNode) {
    expandedKeysSet.value.delete(node.key);
}

const loadingKeysRef = ref(new Set<Key>());
function triggerLoading(node: TreeNode) {
    // 这个节点需要异步加载
    if(!node.children.length && !node.isLeaf) {
        // 如果没有加载过这个节点,就加载这个节点
        const loadingKeys = loadingKeysRef.value;
        if(!loadingKeys.has(node.key)) {
            loadingKeys.add(node.key)
            // 查看用户有没有这个事件
            const onLoad = props.onLoad;
            if(onLoad) {
                onLoad(node.rawNode).then((children) => {
                    // 修改原来的节点
                    node.rawNode.children = children;
                    // 更新自定义的 node
                    node.children = createTree(children, node);
                    loadingKeys.delete(node.key)
                })
            }
        }
    }
}

// 展开
function expand(node: TreeNode) {
    expandedKeysSet.value.add(node.key);

    // 这里实现对应的懒加载逻辑
    triggerLoading(node)
}
// 切换(展开/关闭)
// 4) 让用户展开合并
function toggleExpand(node: TreeNode) {
    const expandKeys = expandedKeysSet.value;
    // 如果这个节点正在加载中,则不能收起
    if(expandKeys.has(node.key) && !loadingKeysRef.value.has(node.key)) {
        collpase(node)
    } else {
        expand(node);
    }
}

// 5) 实现选中节点
const emits = defineEmits(treeEmits);

const selectKeysRef = ref<Key[]>([]);

watch(
    () => props.selectedKeys,
    value => {
        if(value) {
            selectKeysRef.value = value
        }
    },
    {
        immediate: true
    }
)

// 处理选中的节点
function handleSelect(node: TreeNode) {
    let keys = Array.from(selectKeysRef.value)

    if(!props.selectable) return // 如果不能选择什么都不用做了

    if(props.multiple) {
        let index = keys.findIndex(key => key === node.key);
        if(index > -1) {
            keys.splice(index)
        } else {
            keys.push(node.key)
        }    
    } else {
        if(keys.includes(node.key)) {
            keys = []
        } else {
            keys = [node.key]
        }
    }
    
    emits('update:selectedKeys', keys)
}

provide(treeInjectKey, {
    slots: useSlots()
})

const checkedKeysRefs = ref(new Set(props.defaultCheckedKeys));

function isChecked(node: TreeNode) {
    return checkedKeysRefs.value.has(node.key);
}

function isDisabled(node: TreeNode) {
    return !!node.disabled;
}

const indeterminateRefs = ref<Set<Key>>(new Set());
function isIndeterminate(node: TreeNode) {
    return indeterminateRefs.value.has(node.key);
}

// 自上而下的选中
function toggle(node: TreeNode, checked: boolean) {
    if(!node) return
    let checkedKeys = checkedKeysRefs.value;
    // 如果是选中的时候去掉半选状态
    if(checked) {
        indeterminateRefs.value.delete(node.key)
    }
    // 维护当前的 key 列表
    checkedKeys[checked ? 'add' : 'delete'](node.key)

    const children = node.children
    if(children) {
        children.forEach(childNode => {
            if(!childNode.disabled) {
                toggleCheck(childNode, checked)
            }
        })
    }
}

function findNode(key: Key) {
    return flattenTree.value.find(node => node.key === key)
}

function updateCheckedKeys(node: TreeNode) {
    // 自下而上的更新
    if(node && node.parentKey) {
        let parentNode = findNode(node.parentKey)
        if(parentNode) {
            let allChecked = true; // 默认自元素应该全选
            let hasChecked = false; // 子元素有没有被选中

            const nodes = parentNode.children;
            for(const node of nodes) {
                if(checkedKeysRefs.value.has(node.key)) {
                    hasChecked = true; // 子元素被选中了
                } else if(indeterminateRefs.value.has(node.key)){
                    allChecked = false;
                    hasChecked = true;
                } else {
                    allChecked = false;
                }
            }

            // 如果全选中
            if(allChecked) {
                checkedKeysRefs.value.add(parentNode.key);
                indeterminateRefs.value.delete(parentNode.key);
            } else if(hasChecked) {
                checkedKeysRefs.value.delete(parentNode.key);
                indeterminateRefs.value.add(parentNode.key);
            }

            // 调用完去处理父节点
            updateCheckedKeys(parentNode)
        }
    }
}

// 选中的方法
function toggleCheck(node: TreeNode, checked: boolean) {
    toggle(node, checked)

    updateCheckedKeys(node)
}

onMounted(() => {
    checkedKeysRefs.value.forEach((key: Key) => {
        toggleCheck(findNode(key)!, true);
    })
})
</script>

