import {IconSend} from '@douyinfe/semi-icons';
import {Button, Form, Modal, Space, Toast} from '@douyinfe/semi-ui';
import {FormApi} from '@douyinfe/semi-ui/lib/es/form/interface';
import {connect} from 'dva';
// @ts-ignore
import uuid from "node-uuid";
import React, {MutableRefObject, useRef} from 'react';
import intl from 'react-intl-universal';
import ConfigService from '../../service/config';
import RedisService from '../../service/redis';
import tree from '../../utils/tree';
import {ConnectState} from "../../models/connect";


interface ConnectionModalProps {
    dispatch?: any;
    connection?: any;
    lang: string
}

const ConnectionModal = ({dispatch, connection}: ConnectionModalProps) => {

    const {mode} = connection;
    const formApiRef = useRef<MutableRefObject<FormApi>>();

    const saveFormApi = (formApi: FormApi) => {
        // @ts-ignore
        formApiRef.current = formApi;
    }


    const {visible, currentConnection, treeLoading} = connection;

    const onClose = () => {
        dispatch({
            type: 'connection/save',
            payload: {visible: false}
        })
    }

    const onHandleSubmit = async (e: React.MouseEvent) => {
        // @ts-ignore
        const values = await formApiRef.current.validate()
        const data = await ConfigService.readConfig();
        let now;
        if (currentConnection.uid) {
            // update
            const dest = data.findIndex((v: any) => v.key === currentConnection.uid);
            data[dest] = {key: data[dest].key, ...values}
            now = [...data]
            dispatch({
                type: 'connection/save',
                payload: {
                    currentConnection: {
                        ...data[dest],
                        uid: data[dest].key
                    }
                }
            })
        } else {
            // insert
            const key = uuid.v4();
            now = [...data, {key, ...values}]
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

    const onTestConnection = async () => {
        // @ts-ignore
        const values = await formApiRef.current.validate()
        dispatch({
            type: 'connection/save',
            payload: {treeLoading: true}
        })
        RedisService.connect({...values, dispatch})
    }

    return (
        <Modal onCancel={onClose} footer={
            <Space>
                <Button onClick={onTestConnection} loading={treeLoading} type="danger" theme="borderless"
                        icon={<IconSend/>}>
                    {intl.get("modal.connection.footer.test")}
                </Button>
                <Button onClick={onClose}>{intl.get("common.cancel")}</Button>
                <Button onClick={onHandleSubmit} type="primary" theme="solid">{intl.get("common.confirm")}</Button>
            </Space>}
               title={mode === 'create' ? intl.get("form.add_connection.title") : intl.get("form.add_connection.edit_title")}
               visible={visible}>
            <Form getFormApi={formApi => saveFormApi(formApi)} labelPosition='left' initValues={currentConnection}
                  labelAlign='right' wrapperCol={{span: 18}} labelCol={{span: 6}}>
                <Form.Input rules={[{required: true, message: intl.get("form.add_connection.name.placeholder")}]}
                            placeholder={intl.get("form.add_connection.name.placeholder")}
                            field="name" label={intl.get("form.add_connection.name")}/>
                <Form.Input rules={[{required: true, message: intl.get("form.add_connection.domain.placeholder")}]}
                            placeholder={intl.get("form.add_connection.domain.placeholder")}
                            field="host" label={intl.get("form.add_connection.domain")}/>
                <Form.InputNumber style={{width: '80%'}}
                                  rules={[{required: true, message: intl.get("form.add_connection.port.placeholder")}]}
                                  placeholder={intl.get("form.add_connection.port.placeholder")}
                                  field="port" label={intl.get("form.add_connection.port")}/>
                <Form.Input mode="password"
                            placeholder={intl.get("form.add_connection.password.placeholder")}
                            field="password" label={intl.get("form.add_connection.password")}/>
            </Form>
        </Modal>
    )
}

export default connect(({connection}: ConnectState) => ({connection}))(ConnectionModal);