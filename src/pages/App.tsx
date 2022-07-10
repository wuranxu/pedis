import { IconHelpCircle, IconLoading, IconPlus } from '@douyinfe/semi-icons';
import {
    IllustrationIdle,
    IllustrationIdleDark,
    IllustrationNoResult,
    IllustrationNoResultDark
} from '@douyinfe/semi-illustrations';
import { Button, Empty, Row, Select, Spin } from '@douyinfe/semi-ui';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import intl from "react-intl-universal";
import SplitPane from 'react-split-pane';
import LeftTree from '../components/Connection';
import ConnectionModal from '../components/Connection/ConnectionModal';
import PedisHeader from '../components/Header';
import RedisTab from '../components/PedisTab';
import { ConnectState } from '../models/connect';
import { StateProps } from '../models/connection';
import ConfigService from '../service/config';
import RedisService from '../service/redis';
import { Lang } from '../type.d.ts/Lang';
import tree from '../utils/tree';
import "./App.css";

interface AppProps {
    language: Lang;
    connection: StateProps
    dispatch?: any;
}


const App = ({ language: { lang, setLang }, connection, dispatch }: AppProps) => {

    const { treeData, treeLoading, activeKey, currentConnection, tabList, selectedKeys, dbNum, currentDb, redisConn } = connection;

    const [leftSize, setLeftSize] = useState<number>(300);

    const onLoadConfig = async (): Promise<void> => {
        const data = await ConfigService.readConfig()
        const treeData = tree.render(data, dispatch);
        dispatch({
            type: 'connection/save',
            payload: { treeData }
        })
    }

    const onSelectDb = (value: number | null | any) => {
        dispatch({
            type: 'connection/save',
            payload: { currentDb: value }
        })
    }

    const onReloadDatabase = async () => {
        // when change redis, reload
        if (redisConn !== null) {
            const database = await RedisService.loadDatabase(redisConn);
            const dbNumber = parseInt(database, 10)
            dispatch({
                type: 'connection/save',
                payload: { dbNum: dbNumber }
            })
            if (currentDb === null || currentDb >= dbNumber) {
                dispatch({
                    type: 'connection/save',
                    payload: { currentDb: 0 }
                })
            }

        }
    }

    const getDb = () => {
        const ans = []
        for (let i = 0; i < dbNum; i++) {
            ans.push(<Select.Option value={i}>db{i}</Select.Option>)
        }
        return ans;
    }

    useEffect(() => {
        onLoadConfig()
    }, [redisConn])

    useEffect(() => {
        onReloadDatabase()
    }, [redisConn])

    // @ts-ignore
    return (
        <Row>
            <ConnectionModal lang={lang} />
            <PedisHeader lang={lang} setLang={setLang} />
            {/*
        // @ts-ignore */}
            <SplitPane className="pedis-split" split="vertical" minSize={200} defaultSize={300} maxSize={600}
                onDragFinished={size => {
                    document.getElementsByClassName("rightContent")[0].style.width = `calc(100vw - ${size + 27}px)`;
                    setLeftSize(size)
                }}>
                <Row className="leftTree">
                    <Spin size="small" tip={intl.get("common.loading")} spinning={treeLoading}
                        indicator={<IconLoading />}>
                        {treeData.length > 0 ? <LeftTree treeData={treeData} /> : <div className="emptyTree">
                            <Empty
                                style={{ marginTop: '-24%' }}
                                image={<IllustrationNoResult style={{ width: 120, height: 120 }} />}
                                darkModeImage={<IllustrationNoResultDark style={{ width: 120, height: 120 }} />}
                                title={intl.get("empty.no_connection_config")}
                                description={intl.get("empty.no_connection_config.desc")}>
                                <div style={{ textAlign: 'center' }}>
                                    <Button onClick={() => {
                                        dispatch({
                                            type: 'connection/save',
                                            payload: { visible: true, currentConnection: { port: 6379 }, mode: 'create' }
                                        })
                                    }} type="secondary" icon={<IconPlus />}
                                        theme='light'>{intl.get("menu.create_conn")}</Button>
                                </div>
                            </Empty>
                        </div>
                        }
                    </Spin>
                </Row>
                <Row className="rightContent">
                    {
                        tabList.length === 0 || !selectedKeys ? <div className='emptyTree'>
                            <Empty
                                style={{ marginTop: '-15%' }}
                                image={<IllustrationIdle style={{ width: 180, height: 230 }} />}
                                darkModeImage={<IllustrationIdleDark style={{ width: 180, height: 230 }} />}
                                title={intl.get("empty.no_connection")}
                                description={intl.get("empty.no_connection_desc")}
                            >
                                <div style={{ display: "flex" }}>
                                    <Button style={{ padding: '0 24px', marginRight: 12 }} type="primary"
                                        icon={<IconHelpCircle />}>
                                        {intl.get("empty.see_document")}
                                    </Button>
                                    <Button style={{ padding: '0 24px' }} theme="solid" type="primary" icon={<IconPlus />}
                                        onClick={() => {
                                            dispatch({
                                                type: 'connection/save',
                                                payload: {
                                                    visible: true,
                                                    currentConnection: { port: 6379 },
                                                    mode: "create"
                                                }
                                            })
                                        }}>
                                        {intl.get("empty.new_connection")}
                                    </Button>
                                </div>
                            </Empty>
                        </div> :
                            <div className="rightConnection">
                                <RedisTab activeKey={activeKey} dispatch={dispatch} tabList={tabList}
                                    redisConn={redisConn} currentConnection={currentConnection}
                                    selectedKeys={selectedKeys} />
                            </div>
                    }
                    <div className='bottom'>
                        <Select
                            placeholder={intl.get("database.tip")}
                            onChange={onSelectDb} style={{ width: 130, borderRadius: 0 }} value={currentDb}>
                            {
                                getDb()
                            }
                        </Select>
                    </div>
                </Row>

            </SplitPane>
        </Row>
    )
}

export default connect(({ connection }: ConnectState) => ({ connection }))(App)
