import { defineComponent, inject, computed } from 'vue';
import { ZTreeNodeContentProps, treeInjectKey } from './tree';

export default defineComponent ({
    name: 'ZTreeNodeContent',
    props: ZTreeNodeContentProps,
    setup(props) {
        const treeContext = inject(treeInjectKey);
        const node = props.node;
        return () => {
            return treeContext?.slots.default ? treeContext.slots.default({ node }) : node?.label;
        }
    }
})