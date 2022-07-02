import { IconSend, IconServer } from '@douyinfe/semi-icons';
import { Button, Form, Modal, Space, Toast } from '@douyinfe/semi-ui';
import { connect } from 'dva';
import uuid from "node-uuid";
import React from 'react';
import intl from 'react-intl-universal';
import ConfigService from '../../service/config';
import RedisService from '../../service/redis';
import tree from '../../utils/tree';

declare type Mode = 'create' | 'update';

interface ConnectionModalProps {
    mode: Mode | string;
    record?: Map<String, any>;
    visible: boolean;
    onClose: (e: React.MouseEvent) => void;
    dispatch?: any;
    connection?: any;
}

const ConnectionModal = ({ dispatch, mode, visible, connection, onClose }: ConnectionModalProps) => {
    let form: any = null;

    const onHandleSubmit = async (e: React.MouseEvent) => {
        const values = await form.validate()
        const data = await ConfigService.readConfig();
        const now = [...data, { key: uuid.v4(), ...values }]
        const treeData = tree.render(now, <IconServer />)
        dispatch({
            type: 'connection/save',
            payload: {
                treeData,
            }
        })
        ConfigService.writeConfig(now);
        onClose(e)
        Toast.success(intl.get("common.success"))
    }

    const onTestConnection = async () => {
        const values = await form.validate()
        await RedisService.connect(values)
    }

    const getFormApi = (formApi: any) => {
        form = formApi;
    }

    return (
        <Modal onCancel={onClose} footer={
            <Space>
                <Button onClick={onTestConnection} type="danger" theme="borderless" icon={<IconSend />}>
                    {intl.get("modal.connection.footer.test")}
                </Button>
                <Button onClick={onClose} >{intl.get("common.cancel")}</Button>
                <Button onClick={onHandleSubmit} type="primary" theme="solid">{intl.get("common.confirm")}</Button>
            </Space>}
            title={mode === 'create' ? intl.get("form.add_connection.title") : intl.get("form.add_connection.edit_title")} visible={visible}>
            <Form getFormApi={getFormApi} labelPosition='left'
                labelAlign='right' wrapperCol={{ span: 18 }} labelCol={{ span: 6 }}>
                <Form.Input rules={[{ required: true, message: intl.get("form.add_connection.name.placeholder") }]}
                    placeholder={intl.get("form.add_connection.name.placeholder")}
                    field="name" label={intl.get("form.add_connection.name")} />
                <Form.Input rules={[{ required: true, message: intl.get("form.add_connection.domain.placeholder") }]}
                    placeholder={intl.get("form.add_connection.domain.placeholder")}
                    field="host" label={intl.get("form.add_connection.domain")} />
                <Form.InputNumber initValue={6379} style={{ width: '80%' }} rules={[{ required: true, message: intl.get("form.add_connection.port.placeholder") }]}
                    placeholder={intl.get("form.add_connection.port.placeholder")}
                    field="port" label={intl.get("form.add_connection.port")} />
                <Form.Input mode="password"
                    placeholder={intl.get("form.add_connection.password.placeholder")}
                    field="password" label={intl.get("form.add_connection.password")} />
            </Form>
        </Modal>
    )
}

export default connect(({ connection }) => ({ connection }))(ConnectionModal);