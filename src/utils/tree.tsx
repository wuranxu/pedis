import { IconDelete, IconDesktop, IconEdit, IconMore, IconPlay, IconSend } from "@douyinfe/semi-icons";
import { Col, Dropdown, Modal, Row, Toast, Typography } from '@douyinfe/semi-ui';
import intl from 'react-intl-universal';



const { Text } = Typography;

interface TreeNode {
    key: string;
    uid: string;
    name: string;
    host: string;
    port: number;
    password?: string;
    dispatch?: any;
}


const TreeLabel = (props: TreeNode) => {

    const onDeleteNode = () => {
        Modal.warning({
            title: intl.get("connection.delete.title"),
            content: intl.get("connection.delete.content"),
            onOk: async () => {
                const res = await props.dispatch({
                    type: 'connection/removeConnections',
                    payload: { uid: props.uid, dispatch: props.dispatch }
                })
                if (res) {
                    Toast.success(intl.get("common.success"));
                    return;
                }
                Toast.error(intl.get("common.failed"));
            }
        });
    }

    const onTest = () => {
        props.dispatch({
            type: "connection/testConnection",
            payload: props
        })
    }

    const onEdit = () => {
        props.dispatch({
            type: 'connection/save',
            payload: {
                currentConnection: {
                    uid: props.uid,
                    password: props.password,
                    name: props.name, port: props.port, host: props.host
                },
                visible: true,
            }
        })
    }

    return (
        <Row>
            <Col span={20}>
                <Text
                    ellipsis={{
                        showTooltip: {
                            opts: { content: `${props.name}(${props.host}:${props.port})` }
                        }
                    }}
                >
                    {props.name}({props.host}:{props.port})
                </Text>
            </Col>
            <Col span={4}>
                <span style={{ float: 'right', marginRight: 8, lineHeight: '20px' }}>
                    <Dropdown
                        trigger="hover"
                        clickToHide={true}
                        render={
                            <Dropdown.Menu>
                                <Dropdown.Item icon={<IconPlay />} onClick={(e) => {
                                    e.stopPropagation()
                                }}>
                                    {intl.get("tree.operation.open")}
                                </Dropdown.Item>
                                <Dropdown.Item icon={<IconSend />} onClick={(e) => {
                                    e.stopPropagation();
                                    onTest()
                                }}>
                                    {intl.get("tree.operation.test")}
                                </Dropdown.Item>
                                <Dropdown.Item type="primary" onClick={e => {
                                    e.stopPropagation();
                                    onEdit();
                                }} icon={<IconEdit />}>{intl.get("tree.operation.edit")}</Dropdown.Item>
                                <Dropdown.Item type="danger" onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteNode();
                                }} icon={<IconDelete />}>{intl.get("tree.operation.delete")}</Dropdown.Item>
                            </Dropdown.Menu>
                        }
                    >
                        <IconMore />
                    </Dropdown>
                </span>
            </Col>

        </Row>
    )
}

const Label = (item: TreeNode) => {
    return <TreeLabel {...item} />
}

export default {
    render: (nodes: Array<TreeNode>, dispatch: any) => {
        return nodes.map((item: TreeNode) => ({
            key: item.key,
            label: Label({ ...item, dispatch, uid: item.key }),
            search: `${item.name}(${item.host}:${item.port})`,
            children: [],
            icon: <IconDesktop />,
            data: item,
            dispatch,
        }))
    }
}