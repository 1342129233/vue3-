export const treeProps = {
    size: {
        type: Number,
        default: 35
    },
    remain: {
        type: Number,
        default: 8
    },
    items: {
        type: Array,
        default: () => []
    }
}