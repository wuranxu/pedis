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
    static cache = new Map();

    static getKey(params: RedisConnectionProps) {
        const { name, host, port, password } = params;
        return `${name}_${host}_${port}_${password}`
    }

    static async connect(params: RedisConnectionProps) {
        const redis = new Redis(params)
        const key = RedisService.getKey(params)
        RedisService.redisEvent(key, false, redis, params.dispatch)
    }

    static async open(params: RedisConnectionProps) {
        const key = RedisService.getKey(params)
        if (RedisService.cache.get(key)) {
            const redis = RedisService.cache.get(key);
            params.dispatch({
                type: "connection/updateConnectionStatus",
                payload: redis
            })
            return redis
        }
        const redis = new Redis(params)
        RedisService.redisEvent(key, true, redis, params.dispatch)
    }

    static async loadDatabase(redis: any): Promise<string> {
        let dbMax = 16;
        const dbInfo = await redis.config("get", "databases");
        return dbInfo[1] || dbMax

    }

    static redisEvent(key: string, setRedis: boolean, redis: any, dispatch: any) {
        redis.once("error", () => {
            Toast.error(intl.get("modal.connection.footer.test.failed"))
            redis.disconnect()
            dispatch({
                type: "connection/save",
                payload: { treeLoading: false }
            })
            if (setRedis) {
                dispatch({
                    type: "connection/updateConnectionStatus",
                    payload: null
                })
                RedisService.cache.delete(key)
            }
        })

        redis.once("connect", async () => {
            await redis.ping()
            dispatch({
                type: "connection/save",
                payload: { treeLoading: false }
            })
            if (setRedis) {
                dispatch({
                    type: "connection/updateConnectionStatus",
                    payload: redis
                })
                RedisService.cache.set(key, redis);
                return
            }
            Toast.success(intl.get("modal.connection.footer.test.success"))
        })

    }

}