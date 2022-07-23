import {IconBookH5Stroked, IconCopyStroked, IconEditStroked, IconSaveStroked} from "@douyinfe/semi-icons";
import {Card, Col, Input, Row, Space, Tag, Toast, Tooltip, Typography} from "@douyinfe/semi-ui";
import {connect} from "dva";
import React, {useRef, useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import intl from 'react-intl-universal';
import {ConnectState} from "../../models/connect";
import {RedisKeyType, StateProps} from "../../models/connection";
import {hexToString} from "../../utils/string";
import StringKey from "./StringKey";
import {useInterval} from "ahooks";


const {Text} = Typography;

interface KeyProps {
    connection: StateProps;
    key: string;
    keyType: RedisKeyType;
    dispatch: any;
}

const KeyIndex: React.FC<KeyProps> = ({dispatch, connection}: KeyProps) => {
    const {currentSelectedKey, redisConn, currentStringValue, ttl} = connection;
    const editorRef = useRef(null);
    const [editing, setEditing] = useState<boolean>(false);

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

    const renderTitle = (title: string) => {
        return (
            <div>
                <Row gutter={12}>
                    <Col span={12}>
                        <Tooltip content={title}>
                            {
                                !editing ? <Text
                                    ellipsis={{showTooltip: false}}
                                    style={{width: '100%', fontWeight: 600}}
                                >
                                    {title}
                                </Text> : <Input size="small" defaultValue={title} onEnterPress={e => {
                                    const newKeyName = e.target.value;
                                    onRenameKey(title, newKeyName)
                                }}/>
                            }
                        </Tooltip>
                    </Col>
                    <Col span={6}>
                        {intl.get("key.expire")} <Tag size="small" style={{marginLeft: 4}} color='blue'>{ttl}s</Tag>
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
                                        <IconCopyStroked style={{color: "var(--semi-color-success)"}}/>
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
                            </Space>
                        </div>
                    </Col>
                </Row>

            </div>
        )
    }

    useInterval(() => {
        if (currentSelectedKey?.key) {
            dispatch({
                type: 'connection/ttl',
                payload: {redis: redisConn, key: currentSelectedKey.key}
            })
        }
    }, 1000);

    return (
        <Card title={renderTitle(currentSelectedKey.key)} bordered={false} shadows="hover"
              bodyStyle={{height: 'calc(100vh - 203pxø)', padding: 0}}>
            {renderKey()}
        </Card>
    )
}

export default connect(({connection, loading}: ConnectState) => ({connection, loading}))(KeyIndex);