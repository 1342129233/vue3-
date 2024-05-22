<template>
    <z-checkbox 
        v-model="check" 
        :disabled="false"
        :indeterminate="false"
        label="节点"
        @change="handleChange"
    >
    </z-checkbox>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const check = ref(true);

function handleChange(value: boolean) {
    console.log(value)
}
</script>