import { Empty } from '@douyinfe/semi-ui';
import { connect } from 'dva';
import intl from 'react-intl-universal';
import SplitPane from 'react-split-pane';
import empty from "../../../assets/image/empty.svg";
import { ConnectState } from '../../models/connect';
import { StateProps } from '../../models/connection';
import Key from '../Key';
import KeyTree from './KeyTree';


interface RedisOperationProps {
    connection: StateProps;
    dispatch?: any;
}


const RedisOperation = ({ connection, dispatch }: RedisOperationProps) => {
    const { redisConn, activeRedisKey, currentSelectedKey } = connection;
    console.log(currentSelectedKey)

    return <div className="keyBody">
        <SplitPane className="key-split" split="vertical" minSize={200} defaultSize={300} maxSize={600}>
            <div>
                <KeyTree />
            </div>
            <div>
                {
                    currentSelectedKey.key === undefined ? <Empty
                        image={<img src={empty} style={{ height: '200%', width: '100%' }} />}
                        darkModeImage={<img src={empty} style={{ height: '200%', width: '100%' }} />}
                        title={intl.get("empty.no_available_redis_key")}
                        description={intl.get("empty.no_available_redis_key.desc")}
                    /> : <Key />}
            </div>
        </SplitPane>
    </div>
}

export default connect(({ connection }: ConnectState) => ({ connection }))(RedisOperation)


