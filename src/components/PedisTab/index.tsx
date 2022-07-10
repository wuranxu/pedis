import { IconEdit, IconRedo } from "@douyinfe/semi-icons";
import { Button, Empty, TabPane, Tabs } from "@douyinfe/semi-ui";
import RedisOperation from "../RedisOperation";
import intl from 'react-intl-universal';
import loadFailed from '../../../assets/image/loadFailed.svg'
import RedisService from "../../service/redis";

interface RedisTabProps {
    activeKey: string | undefined;
    dispatch: Function;
    tabList: Array<TabItemProps>;
    selectedKeys: any;
    redisConn: any;
    currentConnection: any;
}

export declare interface TabItemProps {
    key: string;
    title: string;
}


const RedisTab = ({ activeKey, dispatch, tabList, selectedKeys, redisConn, currentConnection }: RedisTabProps) => {

    const emptyData = () => {
        return <Empty
            image={<img src={loadFailed} style={{ height: '190%', width: '100%' }} />}
            darkModeImage={<img src={loadFailed} style={{ height: '190%', width: '100%' }} />}
            title={intl.get("empty.no_available_redis")}
            description={intl.get("empty.no_available_redis.desc")}
        >
            <div>
                <Button
                    onClick={async () => {
                        console.log(currentConnection)
                        await RedisService.open({
                            name: currentConnection.name,
                            host: currentConnection.host,
                            port: currentConnection.port,
                            password: currentConnection.password,
                            dispatch: dispatch,
                        });
                    }}
                    style={{ padding: '0 24px', marginLeft: 24 }} theme="solid" type="primary" icon={<IconRedo />}>
                    {intl.get("empty.reconnect_redis")}
                </Button>
                <Button style={{ padding: '0 24px', marginLeft: 12 }}
                    onClick={() => {
                        dispatch({
                            type: 'connection/save',
                            payload: {
                                visible: true,
                                mode: "edit"
                            }
                        })
                    }}
                    type="primary"
                    icon={<IconEdit />}>
                    {intl.get("empty.edit_redis")}
                </Button>

            </div>
        </Empty>
    }

    const onCloseTab = (key: string) => {
        const idx = tabList.findIndex(item => item.key === key);
        if (idx === -1) {
            return
        }
        const temp = [...tabList];
        temp.splice(idx, 1)
        let currentKey = activeKey;
        const currentTreeKey = { ...selectedKeys }
        if (key === activeKey) {
            // need change activeKey
            if (temp.length === 0) {
                // set activeKey to null
                currentKey = '';
            } else {
                currentKey = temp[idx - 1].key;
            }
            currentTreeKey.value = currentKey
        }
        dispatch({
            type: 'connection/save',
            payload: { tabList: temp, activeKey: currentKey, selectedKeys: currentTreeKey }
        })
    }

    const getComponent = () => {
        if (redisConn === null) {
            return emptyData()
        }
        return <RedisOperation />
    }

    return (
        <Tabs
            style={{ width: '95%' }}
            type="card"
            collapsible={true}
            activeKey={activeKey}
            tabPaneMotion={true}
            onTabClose={onCloseTab}
            onChange={async key => {
                const idx = tabList.findIndex(item => item.key === key);
                dispatch({
                    type: 'connection/save',
                    payload: {
                        activeKey: key, selectedKeys: { value: key }, currentConnection: {
                            uid: tabList[idx].key,
                            password: tabList[idx].data.password,
                            name: tabList[idx].data.name, port: tabList[idx].data.port,
                            host: tabList[idx].data.host
                        }
                    }
                })
                await RedisService.open({
                    name: tabList[idx].data.name,
                    host: tabList[idx].data.host,
                    port: tabList[idx].data.port,
                    password: tabList[idx].data.password,
                    dispatch: dispatch,
                });
            }}
        >
            {tabList.map(tab => (
                <TabPane closable tab={tab.title} itemKey={tab.key} key={tab.key}>
                    {getComponent()}
                </TabPane>
            ))}
        </Tabs>
    )
}

export default RedisTab;
