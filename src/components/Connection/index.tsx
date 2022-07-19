import { Empty, Tree } from "@douyinfe/semi-ui";
import { connect } from "dva";
import intl from 'react-intl-universal';
import empty from "../../../assets/image/empty.svg";
import { ConnectState } from "../../models/connect";
import { StateProps } from "../../models/connection";
import RedisService from "../../service/redis";
import "./index.css";

interface TreeProps {
    treeData: Array<any>;
    dispatch?: any;
}

interface LeftTreeProps extends TreeProps {
    connection?: StateProps;

}

const LeftTree = ({ treeData, dispatch, connection }: LeftTreeProps) => {

    // @ts-ignore
    const { tabList, selectedKeys } = connection;

    // const [selectedKeys, setSelectedKeys] = useState<Value>();

    const getTabs = node => {
        const idx = tabList.findIndex(item => item.key === node.key);
        if (idx === -1) {
            return [...tabList, { title: node.search, key: node.key, data: node.data }]
        }
        return tabList;
    }

    const MyEmpty = () => {
        return (
            <Empty
                image={<img src={empty} style={{ height: '200%', width: '100%' }} />}
                darkModeImage={<img src={empty} style={{ height: '200%', width: '100%' }} />}
                title={intl.get("empty.no_connection_data")}
                description={intl.get("empty.no_connection_data.desc")}>
            </Empty>
        )
    }

    return (
        <Tree className="left-body"
            directory
            searchPlaceholder={intl.get("tree.search.placeholder")}
            onChangeWithObject
            emptyContent={<MyEmpty/>}
            showClear
            onChange={async node => {
                dispatch({
                    type: 'connection/save',
                    payload: {
                        tabList: getTabs(node),
                        activeKey: node.key,
                        selectedKeys: { value: node.value },
                        currentConnection: {
                            uid: node.key,
                            password: node.data.password,
                            name: node.data.name, port: node.data.port, host: node.data.host
                        }
                    }
                })
                await RedisService.open({
                    name: node.data.name,
                    host: node.data.host,
                    port: node.data.port,
                    password: node.data.password,
                    dispatch: dispatch,
                });
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

export default connect(({ connection }: ConnectState) => ({ connection }))(LeftTree);
