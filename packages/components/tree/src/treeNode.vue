<template>
    <div :class="[
            bem.b(),
            bem.is('selected', isSelected),
            bem.is('disabled', node.disabled)
        ]">
        <div 
            :class="[
                bem.e('content')
            ]" 
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
                <z-icon size="20" color="#a8abb2">
                    <Switch v-if="!isLoading"></Switch>
                    <Loading v-else></Loading>
                </z-icon>
            </span>
            <z-checkbox
                v-if="showCheckbox" 
                :model-value="checked" 
                :disabled="disabled" 
                :indeterminate="indeterminate"
                @change="handleCheckChange"
            >
            </z-checkbox>
            <span @click="handleSelected" :class="bem.e('balel')">
                <ZTreeNodeContent :node="node"></ZTreeNodeContent>
            </span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue';
import Switch from './icon/Switcher';
import Loading from './icon/Loading';
import ZIcon from '@wangxin/components/icon';
import ZTreeNodeContent from './tree-node-content';
import ZCheckbox from '@wangxin/components/checkbox';
import { createNameSpace } from '@wangxin/utils/create';
import { treeNodeProps, treeNodeEmitts, treeInjectKey, TreeNode } from './tree';

const bem = createNameSpace('tree-node')

const props = defineProps(treeNodeProps)
const emits = defineEmits(treeNodeEmitts)

function handleExpand() {
    emits('toggle', props.node)
}

const isLoading = computed(() => {
    return props.loadingKeys.has(props.node.key)
})

const isSelected = computed(() => {
    return props.selectKeys.includes(props.node.key)
})

function handleSelected() {
    if(props.node.disabled) return
    emits('select', props.node);
}

const treeContext = inject(treeInjectKey)

function handleCheckChange(val: boolean) {
    emits('check', props.node, val);
}

// 选中框状态发生变化的时候执行
const oldChecked = ref<boolean | null>(null)
const oldIndeterminate = ref<boolean | null>(null)
const handleSelectChange = (checked: boolean, indeterminate: boolean) => {
    if(oldChecked.value !== checked || oldIndeterminate.value !== indeterminate) {
        if(treeContext?.emit) {
            treeContext.emit('check-change', props.node, checked, indeterminate);
        }
    }
    oldChecked.value = checked
    oldIndeterminate.value = indeterminate
};

watch(
    () => props.indeterminate,
    (val) => {
        handleSelectChange(props.checked, val)
    }
)

watch(
    () => props.checked,
    (val) => {
        handleSelectChange(val, props.indeterminate)
    }
)
</script>
