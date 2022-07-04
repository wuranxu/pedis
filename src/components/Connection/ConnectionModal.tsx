import { IconSend } from '@douyinfe/semi-icons';
import { Button, Form, Modal, Space, Toast } from '@douyinfe/semi-ui';
import { connect } from 'dva';
import uuid from "node-uuid";
import React, { useRef } from 'react';
import intl from 'react-intl-universal';
import ConfigService from '../../service/config';
import RedisService from '../../service/redis';
import tree from '../../utils/tree';


interface ConnectionModalProps {
    dispatch?: any;
    connection?: any;
    lang: string
}

const ConnectionModal = ({ dispatch, connection }: ConnectionModalProps) => {

    const { mode } = connection;
    const formApiRef = useRef();

    const saveFormApi = (formApi: any) => {
        formApiRef.current = formApi;
    }


    const { visible, currentConnection, treeLoading } = connection;

    const onClose = () => {
        dispatch({
            type: 'connection/save',
            payload: { visible: false }
        })
    }

    const onHandleSubmit = async (e: React.MouseEvent) => {
        const values = await formApiRef.current.validate()
        const data = await ConfigService.readConfig();
        let now;
        if (currentConnection.uid) {
            // update
            const dest = data.findIndex((v: any) => v.key === currentConnection.uid);
            data[dest] = { key: data[dest].key, ...values }
            now = [...data]
        } else {
            // insert
            const key = uuid.v4();
            now = [...data, { key, ...values }]
        }
        const treeData = tree.render(now, dispatch)
        dispatch({
            type: 'connection/save',
            payload: {
                treeData,
            }
        })
        ConfigService.writeConfig(now);
        onClose()
        Toast.success(intl.get("common.success"))
    }

    const onTestConnection = () => {
        const state = formApiRef.current.getFormState()
        console.log(state.values, state.error)
        if (state.error) {
            return;
        }
        dispatch({
            type: 'connection/save',
            payload: { treeLoading: true }
        })
        RedisService.connect({ ...state.values, dispatch })
    }

    return (
        <Modal onCancel={onClose} footer={
            <Space>
                <Button onClick={onTestConnection} loading={treeLoading} type="danger" theme="borderless" icon={<IconSend />}>
                    {intl.get("modal.connection.footer.test")}
                </Button>
                <Button onClick={onClose} >{intl.get("common.cancel")}</Button>
                <Button onClick={onHandleSubmit} type="primary" theme="solid">{intl.get("common.confirm")}</Button>
            </Space>}
            title={mode === 'create' ? intl.get("form.add_connection.title") : intl.get("form.add_connection.edit_title")} visible={visible}>
            <Form getFormApi={formApi => saveFormApi(formApi)} labelPosition='left' initValues={currentConnection}
                labelAlign='right' wrapperCol={{ span: 18 }} labelCol={{ span: 6 }}>
                <Form.Input rules={[{ required: true, message: intl.get("form.add_connection.name.placeholder") }]}
                    placeholder={intl.get("form.add_connection.name.placeholder")}
                    field="name" label={intl.get("form.add_connection.name")} />
                <Form.Input rules={[{ required: true, message: intl.get("form.add_connection.domain.placeholder") }]}
                    placeholder={intl.get("form.add_connection.domain.placeholder")}
                    field="host" label={intl.get("form.add_connection.domain")} />
                <Form.InputNumber style={{ width: '80%' }} rules={[{ required: true, message: intl.get("form.add_connection.port.placeholder") }]}
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