import { Button, Empty } from '@douyinfe/semi-ui';
import { IllustrationIdle, IllustrationIdleDark } from '@douyinfe/semi-illustrations';
import { connect } from 'dva';
import intl from 'react-intl-universal';
import React from 'react';
import { ConnectState } from '../../models/connect';
import { StateProps } from '../../models/connection';
import { IconEdit, IconHelpCircle, IconPlus, IconRedo } from '@douyinfe/semi-icons';
import loadFailed from '../../../assets/image/loadFailed.svg';
import KeyTree from './KeyTree';
import SplitPane from 'react-split-pane';


interface RedisOperationProps {
    connection: StateProps;
    dispatch?: any;
}


const RedisOperation = ({ connection, dispatch }: RedisOperationProps) => {
    const { redisConn } = connection;

    return <div className="keyBody">
        <SplitPane className="key-split" split="vertical" minSize={200} defaultSize={300} maxSize={600}>
            <div>
                <KeyTree />
            </div>
        </SplitPane>
    </div>
}

export default connect(({ connection }: ConnectState) => ({ connection }))(RedisOperation)


