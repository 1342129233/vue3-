<template>
    <div :class="bem.b()">
        <div 
            :class="bem.e('content')" 
            :style="{ paddingLeft: `${node.level * 16}px` }"
        >
            <span 
                :class="[
                    bem.e('expand-icon'), 
                    { expanded: expanded && !node.isLeaf },
                    bem.is('leaf', node.isLeaf)
                ]"
                @click="handleExpand()"
            >
                <z-icon size="20" color="pink">
                    <Switch />
                </z-icon>
            </span>
            <!-- <span>{{ node?.key }}</span> -->
            <span>{{ node?.label }}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import Switch from './icon/Switcher';
import ZIcon from '@wangxin/components/icon';
import { createNameSpace } from '@wangxin/utils/create';
import { treeNodeProps, treeNodeEmitts } from './tree';

const bem = createNameSpace('tree-node')

const props = defineProps(treeNodeProps)
const emits = defineEmits(treeNodeEmitts)

function handleExpand() {
    emits('toggle', props.node)
}
// console.log(props.expanded, props.node)
</script>
