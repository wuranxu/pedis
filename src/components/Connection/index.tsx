import {Tree} from "@douyinfe/semi-ui";
import { Value } from "@douyinfe/semi-ui/lib/es/tree";
import {connect} from "dva";
import { useState } from "react";
import {ConnectState} from "../../models/connect";
import {StateProps} from "../../models/connection";
import "./index.css";


interface TreeProps {
    treeData: Array<any>;
    dispatch?: any;
}

interface LeftTreeProps extends TreeProps {
    connection?: StateProps;

}

const LeftTree = ({treeData, dispatch, connection}: LeftTreeProps) => {

    // @ts-ignore
    const {tabList, selectedKeys} = connection;

    // const [selectedKeys, setSelectedKeys] = useState<Value>();

    return (
        <Tree className="left-body"
              directory
              onChangeWithObject
              onChange={node => {
                  dispatch({
                      type: 'connection/save',
                      payload: {
                          tabList: [...tabList, {title: node.search, key: node.key}],
                          activeKey: node.key,
                          selectedKeys: {value: node.value}
                      }
                  })
              }}
              value={selectedKeys}
              expandAction="click"
              filterTreeNode
              blockNode
              treeNodeFilterProp="search"
              showFilteredOnly={true}
              treeData={treeData}
        />
    )
}

export default connect(({connection}: ConnectState) => ({connection}))(LeftTree);
