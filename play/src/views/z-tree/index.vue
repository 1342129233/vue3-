<script setup lang="ts">
import { ref } from 'vue';

function createData(level = 4, parentKey = ''):any {
    if(!level) return [];
    const arr = new Array(6 - level).fill(0);
    return arr.map((_, idx: number) => {
        const key = parentKey + level + idx;
        return {
            label: createLabel(level),
            key,
            children: createData(level - 1, key)
        }
    });
};

function createLabel(level: number): string {
    if(level === 4) return '道生一';
    if(level === 3) return '一生二';
    if(level === 2) return '二生三';
    if(level === 1) return '三生万物';
    return ''; 
}

const data = ref(createData());
console.log(data.value);
</script>

<template>
    <div>
        <z-tree
            :data="data" 
            label="label" 
            node-key="key" 
            children="children"
            :default-expanded-keys="['41', '4130']"
        >
        </z-tree>
    </div>
</template>

<style scoped>

</style>


