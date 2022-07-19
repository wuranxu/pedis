import { Card } from "@douyinfe/semi-ui";
import { connect } from "dva";
import React from 'react';
import { ConnectState } from "../../models/connect";
import { RedisKeyType, StateProps } from "../../models/connection";
import StringKey from "./StringKey";

interface KeyProps {
    connection: StateProps;
    key: string;
    keyType: RedisKeyType;
    dispatch: any;
}

const KeyIndex: React.FC = ({ dispatch, connection }: KeyProps) => {


    const { currentSelectedKey } = connection;

    const renderKey = () => {
        switch (currentSelectedKey.keyType) {
        case "STRING":
            return <StringKey />
        }
        return null;
    }

    return (
        <Card bordered={false} shadows="hover" title={currentSelectedKey.key}>
            {renderKey()}
        </Card>
    )
}

export default connect(({ connection, loading }: ConnectState) => ({ connection, loading }))(KeyIndex);