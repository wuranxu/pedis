import { IconServer } from "@douyinfe/semi-icons"

export default {
    render: (nodes, icon) => {
        return nodes.map(item => ({
            key: item.key,
            label: item.name,
            children: [],
            icon
        }))
    }
}