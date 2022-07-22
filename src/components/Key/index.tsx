import { IconBookH5Stroked, IconCopyStroked, IconSaveStroked } from "@douyinfe/semi-icons";
import { Card, Col, Row, Space, Toast, Tooltip, Typography } from "@douyinfe/semi-ui";
import { connect } from "dva";
import React, { useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import intl from 'react-intl-universal';
import { ConnectState } from "../../models/connect";
import { RedisKeyType, StateProps } from "../../models/connection";
import { hexToString } from "../../utils/string";
import StringKey from "./StringKey";


const { Text } = Typography;
interface KeyProps {
    connection: StateProps;
    key: string;
    keyType: RedisKeyType;
    dispatch: any;
}

const KeyIndex: React.FC = ({ dispatch, connection }: KeyProps) => {


    const { currentSelectedKey, redisConn, currentStringValue } = connection;
    const editorRef = useRef(null);


    const renderKey = () => {
        switch (currentSelectedKey.keyType) {
            case "STRING":
                return <StringKey editorRef={editorRef} />
        }
        return null;
    }

    const renderTitle = (title) => {
        return (
            <div>
                <Row gutter={16}>
                    <Col span={18}>
                        <Tooltip content={title}>
                            <Text
                                ellipsis={{ showTooltip: true }}
                                style={{ width: '100%', fontWeight: 600 }}
                            >
                                {title}
                            </Text>
                        </Tooltip>
                    </Col>
                    <Col span={6}>
                        <div style={{ float: 'right' }}>
                            <Space>
                                <Tooltip content={intl.get("key.copy")}>
                                    <CopyToClipboard text={title}
                                        onCopy={() => {
                                            Toast.success(intl.get("common.success"))
                                        }}>
                                        <IconCopyStroked style={{ color: "var(--semi-color-primary)" }} />
                                    </CopyToClipboard>
                                </Tooltip>
                                <Tooltip content={intl.get("key.hex_to_str")}>
                                    <IconBookH5Stroked style={{ color: "var(--semi-color-warning)" }} onClick={() => {
                                        const hexStr = hexToString(currentStringValue);
                                        editorRef.editor.setValue(hexStr);
                                    }} />
                                </Tooltip>
                                <Tooltip content={intl.get("key.save")}>
                                    <IconSaveStroked style={{ color: "var(--semi-color-primary)" }} onClick={async () => {
                                        const res = await dispatch({
                                            type: 'connection/setString',
                                            payload: { redis: redisConn, key: currentSelectedKey.key, value: editorRef.editor.getValue() }
                                        })
                                        if (res === 'OK') {
                                            Toast.success(intl.get("common.success"));
                                            return
                                        }
                                        Toast.error(intl.get("common.failed"))
                                    }} />
                                </Tooltip>
                            </Space>
                        </div>
                    </Col>
                </Row>

            </div>
        )
    }

    return (
        <Card title={renderTitle(currentSelectedKey.key)} bordered={false} shadows="hover" bodyStyle={{ height: 'calc(100vh - 203pxø)', padding: 0 }}>
            {renderKey()}
        </Card>
    )
}

export default connect(({ connection, loading }: ConnectState) => ({ connection, loading }))(KeyIndex);