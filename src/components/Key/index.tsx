import {
    IconBookH5Stroked,
    IconCopyStroked,
    IconEditStroked,
    IconHelpCircleStroked, IconRefresh,
    IconSaveStroked,
    IconUndo
} from "@douyinfe/semi-icons";
import {Card, Col, Input, InputNumber, Row, Space, Tag, Toast, Tooltip, Typography} from "@douyinfe/semi-ui";
import {connect} from "dva";
import React, {useRef, useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import intl from 'react-intl-universal';
import {ConnectState} from "../../models/connect";
import {RedisKeyType, StateProps} from "../../models/connection";
import {hexToString} from "../../utils/string";
import StringKey from "./StringKey";
import {useInterval} from "ahooks";
import RedisService from "../../service/redis";
import "./index.css"


const {Text} = Typography;

interface KeyProps {
    connection: StateProps;
    key: string;
    keyType: RedisKeyType;
    dispatch: any;
}

const KeyIndex: React.FC<KeyProps> = ({dispatch, connection}: KeyProps) => {
    const {currentSelectedKey, redisConn, currentStringValue} = connection;
    const editorRef = useRef(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [editingExpire, setEditingExpire] = useState<boolean>(false);
    const [ttl, setTtl] = useState<number>(0);

    const renderKey = () => {
        switch (currentSelectedKey.keyType) {
            case "STRING":
                return <StringKey editorRef={editorRef}/>
        }
        return null;
    }

    const onRenameKey = async (old: string, now: string) => {
        const ans = await dispatch({
            type: 'connection/renameKey',
            payload: {
                redis: redisConn,
                old, now
            }
        })
        if (ans === 'OK') {
            Toast.success(intl.get("common.success"))
            dispatch({
                type: 'connection/editKeyName',
                payload: {
                    old, now
                }
            })
            setEditing(false)
            return;
        }
        Toast.error(intl.get("common.failed"))
    }

    const getTtl = () => {
        if (ttl === -1) {
            return intl.get("key.no_expire")
        }
        if (ttl === -2) {
            return intl.get("key.expired")
        }
        if (ttl === 0) {
            return intl.get("key.expire.loading")
        }
        return `${ttl}s`
    }

    const renderTitle = (title: string) => {

        useInterval(async () => {
            if (currentSelectedKey?.key && ttl >= 0) {
                const res = await RedisService.ttl({redis: redisConn, key: currentSelectedKey.key})
                // dispatch({
                //     type: 'connection/ttl',
                //     payload: {redis: redisConn, key: currentSelectedKey.key}
                // })
                setTtl(res)
            }
        }, 1000);

        return (
            <div>
                <Row gutter={8}>
                    <Col span={11}>
                        <Tooltip content={title}>
                            {
                                !editing ? <Text
                                    ellipsis={{showTooltip: false}}
                                    style={{width: '100%', fontWeight: 600}}
                                >
                                    {title}
                                </Text> : <Input size="small" defaultValue={title}
                                                 suffix={
                                                     <IconUndo style={{fontSize: 14}} onClick={() => {
                                                         setEditing(false)
                                                     }}/>
                                                 }
                                                 onEnterPress={e => {
                                                     const newKeyName = e.target.value;
                                                     onRenameKey(title, newKeyName)
                                                 }}/>
                            }
                        </Tooltip>
                    </Col>
                    <Col span={7}>
                        {intl.get("key.expire")}
                        {!editingExpire ?
                            <Tag onClick={() => {
                                if (ttl === -2) {
                                    Toast.warning(intl.get("key.expire.message"))
                                }
                                setEditingExpire(true)
                            }} size="small" style={{marginLeft: 4}} color='blue'>
                                <Tooltip content={intl.get("key.expire.help")}>
                                    <IconHelpCircleStroked style={{marginRight: 4}}/>
                                </Tooltip>
                                {getTtl()}
                            </Tag> :
                            <InputNumber size="small" style={{width: 112, marginLeft: 6}} min={-1} defaultValue={ttl}
                                         onEnterPress={async e => {
                                             const seconds = e.target.value
                                             const res = await dispatch({
                                                 type: 'connection/expireKey',
                                                 payload: {
                                                     redis: redisConn,
                                                     key: title,
                                                     seconds
                                                 }
                                             })
                                             if (res) {
                                                 setEditingExpire(false)
                                                 setTtl(parseInt(seconds))
                                             }
                                         }}
                                         suffix={
                                             <IconUndo style={{fontSize: 14}} onClick={() => {
                                                 setEditingExpire(false)
                                             }}/>
                                         }/>
                        }
                    </Col>
                    <Col span={6}>
                        <div style={{float: 'right'}}>
                            <Space>
                                <Tooltip content={intl.get("key.edit")}>
                                    <IconEditStroked onClick={() => setEditing(true)}/>
                                </Tooltip>
                                <Tooltip content={intl.get("key.copy")}>
                                    <CopyToClipboard text={title}
                                                     onCopy={() => {
                                                         Toast.success(intl.get("common.success"))
                                                     }}>
                                        <IconCopyStroked className="icon-copy"/>
                                    </CopyToClipboard>
                                </Tooltip>
                                <Tooltip content={intl.get("key.hex_to_str")}>
                                    <IconBookH5Stroked style={{color: "var(--semi-color-warning)"}} onClick={() => {
                                        const hexStr = hexToString(currentStringValue);
                                        editorRef.editor.setValue(hexStr);
                                    }}/>
                                </Tooltip>
                                <Tooltip content={intl.get("key.save")}>
                                    <IconSaveStroked style={{color: "var(--semi-color-primary)"}} onClick={async () => {
                                        const res = await dispatch({
                                            type: 'connection/setString',
                                            payload: {
                                                redis: redisConn,
                                                key: currentSelectedKey.key,
                                                value: editorRef.editor.getValue()
                                            }
                                        })
                                        if (res === 'OK') {
                                            Toast.success(intl.get("common.success"));
                                            return
                                        }
                                        Toast.error(intl.get("common.failed"))
                                    }}/>
                                </Tooltip>
                                <Tooltip content={intl.get("key.reload")}>
                                    <IconRefresh style={{color: 'var(--semi-color-danger-hover)'}} onClick={() => {
                                        editorRef.editor.setValue(currentStringValue);
                                    }}/>
                                </Tooltip>
                            </Space>
                        </div>
                    </Col>
                </Row>

            </div>
        )
    }

    return (
        <Card title={renderTitle(currentSelectedKey.key)} bordered={false} shadows="hover"
              bodyStyle={{height: 'calc(100vh - 203px)', padding: 0}}>
            {renderKey()}
        </Card>
    )
}

export default connect((
    {
        connection, loading
    }
        : ConnectState) => (
    {
        connection, loading
    }
))(KeyIndex);