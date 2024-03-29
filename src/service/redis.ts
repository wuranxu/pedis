import {Toast} from '@douyinfe/semi-ui';
import intl from 'react-intl-universal';

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
        const {name, host, port, password} = params;
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

    static async loadKeyCount(redis: any): Promise<string[]> {
        const data = await redis.info('Keyspace')
        return data.split("\n")
    }

    static async fetchKeys({redis, key}: any) {
        let searchKey = key;
        if (key === undefined || key === '') {
            searchKey = `*`
        } else if (key.indexOf("*") === -1) {
            searchKey = `*${key}*`
        }
        const keys = await redis.keys(searchKey)
        const items = []
        for await (const key of keys) {
            const tp = await RedisService.getType(redis, key)
            items.push({name: key, type: tp.toUpperCase()})
        }
        return items;
    }

    static async getString({redis, key}: any) {
        return await redis.get(key);
    }

    static async setString({redis, key, value, ttl}: any) {
        if (ttl === -1) {
            return await redis.set(key, value)
        }
        return await redis.set(key, value, "EX", ttl)
    }

    static async renameKey({redis, old, now}: any) {
        return await redis.rename(old, now)
    }

    static async ttl({redis, key}: any) {
        return await redis.ttl(key)
    }

    static async deleteKey({redis, key}: any) {
        return await redis.del(key)
    }

    static async expireKey({redis, key, seconds}: any) {
        return await redis.expire(key, seconds)
    }

    static async persist({redis, key}: any) {
        return await redis.persist(key)
    }

    static async getType(redis: any, key: string) {
        return await redis.type(key);
    }

    static redisEvent(key: string, setRedis: boolean, redis: any, dispatch: any) {
        redis.once("error", () => {
            Toast.error(intl.get("modal.connection.footer.test.failed"))
            redis.disconnect()
            dispatch({
                type: "connection/save",
                payload: {treeLoading: false}
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
                payload: {treeLoading: false}
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