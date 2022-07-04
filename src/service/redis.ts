import { Toast } from '@douyinfe/semi-ui';
import intl from 'react-intl-universal';
// import Redis from 'ioredis';
let Redis = window.require('ioredis')

interface RedisConnectionProps {
    name: string;
    host: string;
    port: number;
    password?: string;
    dispatch?: any;
}

export default class RedisService {

    static async connect(params: RedisConnectionProps) {
        const redis = new Redis(params)
        RedisService.redisEvent(redis, params.dispatch)
    }

    static redisEvent(redis: any, dispatch: any) {
        redis.once("error", function () {
            Toast.error(intl.get("modal.connection.footer.test.failed"))
            redis.disconnect()
            dispatch({
                type: "connection/save",
                payload: {treeLoading: false}
            })
        })

        redis.once("connect", async function () {
            await redis.ping()
            Toast.success(intl.get("modal.connection.footer.test.success"))
            dispatch({
                type: "connection/save",
                payload: {treeLoading: false}
            })
        })

    }

}