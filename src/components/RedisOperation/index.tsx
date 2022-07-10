import { Button, Empty } from '@douyinfe/semi-ui';
import { IllustrationIdle, IllustrationIdleDark } from '@douyinfe/semi-illustrations';
import { connect } from 'dva';
import intl from 'react-intl-universal';
import React from 'react';
import { ConnectState } from '../../models/connect';
import { StateProps } from '../../models/connection';
import { IconEdit, IconHelpCircle, IconPlus, IconRedo } from '@douyinfe/semi-icons';
import loadFailed from '../../../assets/image/loadFailed.svg';


interface RedisOperationProps {
    connection: StateProps;
    dispatch?: any;
}


const RedisOperation = ({ connection, dispatch }: RedisOperationProps) => {
    const { redisConn } = connection;

    return <div></div>
}

export default connect(({ connection }: ConnectState) => ({ connection }))(RedisOperation)


