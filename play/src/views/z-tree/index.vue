<script setup lang="ts">
import { ref } from 'vue';
import { TreeOption, Key } from '@wangxin/components/tree';

// 模拟数据一
function createData(level = 4, parentKey = ''):any {
    if(!level) return [];
    const arr = new Array(30 - level).fill(0);
    return arr.map((_, idx: number) => {
        const key = parentKey + level + idx;
        return {
            label: createLabel(level),
            key,
            children: createData(level - 1, key)
        }
    });
};

function createLabel(level?: number): string {
    if(level === 4) return '道生一';
    if(level === 3) return '一生二';
    if(level === 2) return '二生三';
    if(level === 1) return '三生万物';
    return ''; 
}

// 模拟数据二
// function createData() {
//     return [
//         {
//             label: nextLabel(),
//             key: 1,
//             isLeaf: false // 这里 isLeaf 为 false 表示点击的时候动态的加载子节点
//         },
//         {
//             label: nextLabel(),
//             key: 2,
//             isLeaf: false
//         }
//     ];
// }

function nextLabel(currentLabel?: string | number): string {
    if (!currentLabel) return 'Out of Tao, One is born';
    if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two';
    if (currentLabel === 'Out of One, Two') return 'Out of Two, Tree';
    if (currentLabel === 'Out of Two, Tree') {
        return 'Out of Tree, the create universe';
    }
    if(currentLabel === 'Out of Tree, the create universe') {
        return 'Out of Tao, One is born';
    }
    return '';
}

const data = ref(createData());
// const data = ref<TreeOption[]>([
//     {
//         key: '0',
//         label: '0',
//         children: [
//             {
//                 key: '0-0',
//                 label: '0-0'
//             },
//             {
//                 disabled: true,
//                 key: '0-1',
//                 label: '0-1',
//                 children: [
//                     {
//                         key: '0-1-0',
//                         label: '0-1-0'
//                     },
//                     {
//                         key: '0-1-1',
//                         label: '0-1-1'
//                     }
//                 ]
//             }
//         ]
//     }
// ]);

const handleLoad = (node: TreeOption) => {
    // 内部肯定需要将展开的节点传递给我
    return new Promise<TreeOption[]>((resolve, reject) => {
        setTimeout(() => {
            // 这个数据会作为当前展开的 node 的 children 属性
            resolve([
                {
                    label: nextLabel(node.label!),
                    key: node.key + nextLabel(node.label!),
                    isLeaf: false
                }
            ]);
        }, 1000)
    })
}

const value = ref<Key[]>([]);
</script>

<template>
    <div>
        <!-- <z-tree
            :data="data" 
            label="label" 
            node-key="key" 
            children="children"
            :default-expanded-keys="['41', '4130']"
        >
        </z-tree> -->
        <!-- selectable 意味着可以选择节点, multiple 意味着可以多选节点 -->

        <z-tree
            :data="data"
            :on-load="handleLoad"
            v-model:selectedKeys="value"
            selectable
            :multiple="true"
        >
            <template #default="{ node }">
                {{ node.key }} - {{ node.label }}
            </template>
        </z-tree>

    </div>
</template>

<style scoped>

</style>


