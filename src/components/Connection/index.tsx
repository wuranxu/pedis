import { IconMapPin } from "@douyinfe/semi-icons";
import { Tree } from "@douyinfe/semi-ui";
import "./index.css";


const LeftTree = () => {
    const treeData = [
        {
            label: 'Asia',
            value: 'Asia',
            key: '0',
            icon: (<IconMapPin style={{ color: 'var(--semi-color-text-2)' }} />),
            children: [
                {
                    label: 'China',
                    value: 'China',
                    key: '0-0',
                    icon: (<IconMapPin style={{ color: 'var(--semi-color-text-2)' }} />)
                },
                {
                    label: 'Japan',
                    value: 'Japan',
                    key: '0-1',
                    icon: (<IconMapPin style={{ color: 'var(--semi-color-text-2)' }} />)
                },
            ],
        }
    ];
    return (
        <Tree className="left-body"
            treeData={treeData}
        />
    )
}

export default LeftTree;