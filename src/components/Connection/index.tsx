import {Tree} from "@douyinfe/semi-ui";
import {connect} from "dva";
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
    const {selectedKeys, tabList} = connection;

    return (
        <Tree className="left-body"
              directory
              onChangeWithObject
              onChange={node => {
                  console.log(node)
                  dispatch({
                      type: 'connection/save',
                      payload: {
                          selectedKeys: node.key,
                          tabList: [...tabList, {title: node.search, key: node.key}],
                          activeKey: node.key
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
