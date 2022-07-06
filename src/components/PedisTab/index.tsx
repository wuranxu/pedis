import {TabPane, Tabs} from "@douyinfe/semi-ui";

interface RedisTabProps {
    activeKey: string | undefined;
    dispatch: Function;
    tabList: Array<TabItemProps>;
}

export declare interface TabItemProps {
    key: string;
    title: string;
}


const RedisTab = ({activeKey, dispatch, tabList}: RedisTabProps) => {


    return (
        <Tabs
            style={{width: '90%'}}
            type="card"
            collapsible={true}
            activeKey={activeKey}
            tabPaneMotion={false}
            onChange={key => {
                dispatch({
                    type: 'connection/save',
                    payload: {activeKey: key}
                })
            }}
        >
            {tabList.map(tab => (
                <TabPane closable tab={tab.title} itemKey={tab.key} key={tab.key}>
                    这里是redis的数据了哦
                </TabPane>
            ))}
        </Tabs>
    )
}

export default RedisTab;
