import { IconMapPin } from "@douyinfe/semi-icons";
import { Tree } from "@douyinfe/semi-ui";
import "./index.css";


interface TreeProps {
    treeData: Array<any>;
}

const LeftTree = ({treeData}: TreeProps) => {
    // const treeData = [
    //     {
    //         label: 'Asia',
    //         value: 'Asia',
    //         key: '0',
    //         children: [
    //             {
    //                 label: 'China',
    //                 value: 'China',
    //                 key: '0-0',
    //             },
    //             {
    //                 label: 'Japan',
    //                 value: 'Japan',
    //                 key: '0-1',
    //             },
    //         ],
    //     }
    // ];
    return (
        <Tree className="left-body"
            directory
            expandAction="click"
            filterTreeNode
            blockNode
            showFilteredOnly={true}
            treeData={treeData}
        />
    )
}

export default LeftTree;