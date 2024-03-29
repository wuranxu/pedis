import {Button, Col, Empty, Input, List, Row, Skeleton, Space, Tag, Tooltip} from '@douyinfe/semi-ui';
import {ListView, Plus, Terminal, TreeDiagram} from '@icon-park/react';
import {connect} from 'dva';
import {useEffect, useState} from 'react';
import intl from 'react-intl-universal';
import emptySearch from '../../../assets/image/emptySearchResult.svg';
import {ConnectState} from '../../models/connect';
import {RedisKeyType, StateProps} from '../../models/connection';
import "./KeyTree.css";

enum View {
    list = 0,
    tree = 1
}

interface KeyTreeProps {
    connection: StateProps;
    dispatch: any;
    loading: any;
}

const limit: number = 10;

const KeyTree = ({connection, dispatch, loading}: KeyTreeProps) => {
    const {keyData, redisConn, keyList} = connection;

    const [view, setView] = useState<View>(View.list);
    const [count, setCount] = useState<number>(0);
    const [value, setValue] = useState<string>('');
    const [selectedKey, setSelectedKey] = useState<string>('');

    useEffect(() => {
        loadKeys(value)
    }, [])

    useEffect(() => {
        dispatch({
            type: 'connection/save',
            payload: {
                keyList: keyData.slice(0, count * limit)
            }
        })
    }, [count])

    const loadKeys = async (redisKey: string = value) => {
        await dispatch({
            type: 'connection/loadKeys',
            payload: {
                redis: redisConn, key: redisKey
            }
        })
        setCount(1)
    }


    const onLoadMore = () => {
        dispatch({
            type: 'connection/save',
            payload: {
                keyList: keyData.slice(0, limit * count + 1)
            }
        })
        setCount(count + 1)
    }

    const ListHeader = <Row>
        <Col span={18}>
            <Input size="small" style={{width: '92%'}} placeholder={intl.get("search.key")} onEnterPress={e => {
                loadKeys(e.target.value)
            }} value={value} onChange={str => setValue(str)}/>
            {/*<Input size="small" style={{width: '92%'}}*/}
            {/*    // autofocus*/}

            {/*       value={value}*/}
            {/*       onChange={(e) => setValue(e)} placeholder={intl.get("search.key")}*/}
            {/*       prefix={<IconSearch/>}/>*/}
        </Col>
        <Col span={6}>
            <div className="operations">
                <Space>
                    <Plus theme="outline" size="16" fill="#0077FB"/>
                    {
                        view === View.tree ? <ListView theme="outline" size="16" fill="#6700cc"/>
                            : <TreeDiagram theme="outline" size="16" fill="#7ed321"/>
                    }
                    <Terminal theme="outline" size="16" fill="#ff5722"/>
                </Space>
            </div>
        </Col>
    </Row>


    const onSearch = (key: string) => {
        loadKeys(key)
    };

    const loadMore =
        !loading.effects['connection/loadKeys'] && keyList.length < keyData.length ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button size="small" onClick={onLoadMore}>{intl.get("key.list.loadMore")}</Button>
            </div>
        ) : null;

    const placeholder = (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: 12,
                borderBottom: '1px solid var(--semi-color-border)',
            }}
        >
            <Skeleton.Avatar style={{marginRight: 12}}/>
            <div>
                <Skeleton.Paragraph rows={1}/>
            </div>
        </div>
    );

    // @ts-ignore
    return (
        <div>
            <List
                className="key-semi-list"
                loading={loading.effects['connection/loadKeys']}
                dataSource={keyList}
                split={false}
                bordered={false}
                size='small'
                emptyContent={
                    <Empty
                        image={<img src={emptySearch} style={{height: '190%', width: '100%'}}/>}
                        darkModeImage={<img src={emptySearch} style={{height: '190%', width: '100%'}}/>}
                        title={intl.get("empty.no_keys")}
                        description={intl.get("empty.no_keys.desc")}>
                    </Empty>
                }
                header={ListHeader}
                loadMore={loadMore}
                renderItem={item =>
                    <Skeleton placeholder={placeholder} loading={loading.effects['connection/loadKeys']}>
                        <Tooltip content={item.name} position="leftTop" style={{width: 200, wordBreak: 'break-all'}}>
                            <List.Item className='key-list-item' key={item.name}
                                       style={{background: item.name === selectedKey ? 'var(--semi-color-primary-light-default)' : "inherit"}}
                                       onClick={() => {
                                           setSelectedKey(item.name)
                                           dispatch({
                                               type: 'connection/save',
                                               payload: {currentSelectedKey: {key: item.name, keyType: item.type}}
                                           })
                                       }}>
                                {/*@ts-ignore*/}
                                <Tag className='tag-semi-tag' color={RedisKeyType[item.type]}>
                                    {item.type}</Tag>
                                <span style={{
                                    marginLeft: 8, whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>{item.name}</span>
                            </List.Item>
                        </Tooltip>
                    </Skeleton>

                }
            />
        </div>
    )
}

export default connect(({connection, loading}: ConnectState) => ({connection, loading}))(KeyTree);