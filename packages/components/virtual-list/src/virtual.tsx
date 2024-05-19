import { createNameSpace } from '@wangxin/utils/create';
import { defineComponent, onMounted, ref, reactive, computed, watch } from 'vue';
import { treeProps } from './virtual';

export default defineComponent({
    name: 'ZVirtualList',
    props: treeProps,
    setup(props, { slots }) {
        const bem = createNameSpace('virtual-list');
        const wrapperRef = ref<HTMLElement>();
        const barRef = ref<HTMLElement>();
        // 计算显示的区域
        const state = reactive({
            start: 0,
            end: props.remain
        })

        const prev = computed(() => {
            // 当前开始第四条
            return Math.min(state.start, props.remain);
        })

        const next = computed(() => {
            return Math.min(props.remain, props.items.length - state.end);
        })

        // 这里应该多展示,上8条和下8条,保证用户在快速滚动的时候,不回白屏
        const visibleData = computed(() => {
            // 上下都补
            return props.items.slice(state.start - prev.value, state.end + next.value);
        })

        const offset= ref(0); // 偏移量
        const handleScroll = () => {
            // 根据当前滚动的距离来算,过去了几个数据
            const scrollTop = wrapperRef.value!.scrollTop;

            state.start = Math.floor(scrollTop / props.size); // 划过去了多少个
            state.end = state.start + props.remain;

            offset.value = state.start * props.size - props.size * prev.value; // 滚动过去多少个

        }

        function initWrapper() {
            wrapperRef.value!.style.height = props.remain * props.size + 'px'
            barRef.value!.style.height = props.items.length * props.size + 'px'
        }
        watch(
            () => props.items,
            initWrapper
        )
        onMounted(() => {
            initWrapper()
        })
        return () => {
            return (
                <div class={bem.b()} ref={wrapperRef} onScroll={handleScroll}>
                    <div class={bem.e('scroll-bar')} ref={barRef}></div>
                    <div
                        class={bem.e('scroll-list')}
                        style={{ transform: `translate3d(0, ${offset.value}px, 0)` }}
                    >
                        { visibleData.value.map((node, idx) => slots.default({ node })) }
                    </div>
                </div>
            )
        }
    }
})
