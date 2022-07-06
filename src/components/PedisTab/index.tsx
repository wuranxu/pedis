import { TabPane, Tabs } from "@douyinfe/semi-ui";

interface RedisTabProps {
    activeKey: string | undefined;
    dispatch: Function;
    tabList: Array<TabItemProps>;
}

export declare interface TabItemProps {
    key: string;
    title: string;
}


const RedisTab = ({ activeKey, dispatch, tabList }: RedisTabProps) => {
    return (
        <Tabs
            activeKey={activeKey}
            onChange={key => {
                dispatch({
                    type: 'connection/save',
                    payload: { activeKey: key }
                })
            }}
        >
            {tabList.map(tab => (
                <TabPane tab={tab.title} itemKey={tab.key} key={tab.key}>
                    nini
                </TabPane>
            ))}
        </Tabs>
    )
}

export default RedisTab;
