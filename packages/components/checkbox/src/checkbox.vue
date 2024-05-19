<template>
    <label :class="bem.b()">
        <span :class="bem.e('input')">
            <input 
                ref="inputRef" 
                v-model="model" 
                type="checkbox" 
                :disabled="disabled"
                :value="label"
                @change="handleChange"
            />
        </span>

        <span v-if="$slots.default || label" :class="bem.e('label')">
            <slot></slot>
            <template v-if="!$slots.default">{{ label }}</template>
        </span>
    </label>
</template>

<script lang="ts" setup>
import { computed, watch, onMounted, ref } from 'vue';
import { createNameSpace } from '@wangxin/utils/create';
import { checkboxEmits, checkboxProps } from './checkbox';

const bem = createNameSpace('checkbox');
const props = defineProps(checkboxProps);
const emits = defineEmits(checkboxEmits);

defineOptions({
    name: 'z-checkbox'
})
const inputRef = ref<HTMLInputElement>();
const model = computed({
    get: () => {
        return props.modelValue;
    },
    set: (val) => {
        emits('update:modelValue', val!)
    }
})
function indeterminate(val: boolean) {
    inputRef.value!.indeterminate = val;
}

function handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = target.checked ? true : false;
    emits('change', value);
}

watch(() => props.indeterminate, indeterminate);

watch(() => props.modelValue, (val) => {
    if(!!val && props.indeterminate) {
        indeterminate(true)
    }
});

onMounted(() => {
    indeterminate(props.indeterminate)
})
</script>

