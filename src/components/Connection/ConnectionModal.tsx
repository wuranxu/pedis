import { Button, Form, Modal, Space } from '@douyinfe/semi-ui';
import React from 'react';
import intl from 'react-intl-universal';

declare type Mode = 'create' | 'update';

interface ConnectionModalProps {
    mode: Mode | string;
    record?: Map<String, any>;
    visible: boolean;
    onClose: (e: React.MouseEvent) => void;
}

export default (props: ConnectionModalProps) => {
    return (
        <Modal onCancel={props.onClose} footer={
            <Space>
                <Button type="danger" theme="borderless">{intl.get("modal.connection.footer.test")}</Button>
                <Button onClick={props.onClose} >{intl.get("common.cancel")}</Button>
                <Button type="primary" theme="solid">{intl.get("common.confirm")}</Button>
            </Space>}
            title={props.mode === 'create' ? intl.get("form.add_connection.title") : intl.get("form.add_connection.edit_title")} visible={props.visible}>
            <Form labelPosition='left'
                labelAlign='right' wrapperCol={{ span: 18 }} labelCol={{ span: 6 }}>
                <Form.Input rules={[{ required: true, message: intl.get("form.add_connection.name.placeholder") }]}
                    placeholder={intl.get("form.add_connection.name.placeholder")}
                    field="name" label={intl.get("form.add_connection.name")} />
                <Form.Input rules={[{ required: true, message: intl.get("form.add_connection.domain.placeholder") }]}
                    placeholder={intl.get("form.add_connection.domain.placeholder")}
                    field="domain" label={intl.get("form.add_connection.domain")} />
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