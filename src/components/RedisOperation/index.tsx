import { connect } from 'dva';
import SplitPane from 'react-split-pane';
import { ConnectState } from '../../models/connect';
import { StateProps } from '../../models/connection';
import KeyTree from './KeyTree';


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
            <div>
                hh
            </div>
        </SplitPane>
    </div>
}

export default connect(({ connection }: ConnectState) => ({ connection }))(RedisOperation)


