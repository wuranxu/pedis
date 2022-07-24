import {Value} from "@douyinfe/semi-ui/lib/es/tree";
import {Effect} from "dva";
import {removeConfig} from "../service/config";
import RedisService from "../service/redis";
import tree from "../utils/tree";
import {Toast} from "@douyinfe/semi-ui";
import intl from 'react-intl-universal';

export interface ConnectionState {
    data?: string;
}

export enum RedisKeyType {
    LIST = "teal",
    SET = "orange",
    STRING = "blue",
    HASH = "green",
    ZSET = "violet",
    STREAM = "red"
}

export interface RedisKeyProps {
    name: string;
    type: RedisKeyType;
}

export interface StateProps {
    treeData: any[];
    originData: any[];

    currentConnection: any;
    visible: boolean;
    treeLoading: boolean;
    mode: string | 'create';
    activeKey: string | null;
    selectedKeys: Value | null;
    tabList: any[];
    dbNum: number;
    currentDb: number | null | any;
    redisConn?: any;
    redisKeys: Map<number, number>;
    keyData: RedisKeyProps[],
    keyList: RedisKeyProps[],
    keyType: RedisKeyProps[],
    activeRedisKey: string;

    currentSelectedKey: {},
    currentStringValue: string;
    ttl: number;
}

export type ConnectionModelType = {
    namespace: string;
    state: StateProps;
    effects: {
        removeConnections: Effect;
        testConnection: Effect;
        loadKeys: Effect;
        getString: Effect;
        setString: Effect;
        renameKey: Effect;
        ttl: Effect;
        expireKey: Effect;
    };
    reducers: {
        save: any;
        updateConnectionStatus: any;
        editKeyName: any;
    };
};


const Model: ConnectionModelType = {
    namespace: 'connection',
    state: {
        treeData: [],
        originData: [],

        // current data
        currentConnection: {},

        // visible
        visible: false,

        treeLoading: false,

        mode: "create",

        // tab and currentKey
        activeKey: '',
        tabList: [],
        selectedKeys: null,

        // database number
        dbNum: 0,
        currentDb: null,
        redisConn: null,
        redisKeys: new Map<number, number>(),
        keyData: [],
        keyList: [],
        keyType: [],
        activeRedisKey: '',
        currentStringValue: '',
        currentSelectedKey: {},
        ttl: 0,
    },

    reducers: {
        save(state: StateProps, action: { payload: any }) {
            return {
                ...state,
                ...action.payload,
            }
        },

        updateConnectionStatus(state: StateProps, action: { payload: any }) {
            return {
                ...state,
                redisConn: action.payload
            }
        },

        editKeyName(state: StateProps, action: { payload: any }) {
            const data = [...state.keyList]
            const idx = data.findIndex(item => item.name === action.payload.old)
            if (idx > -1) {
                data[idx] = {...data[idx], name: action.payload.now}
            }
            return {
                ...state,
                currentSelectedKey: {...state.currentSelectedKey, key: action.payload.now},
                keyList: data,
            }
        }
    },

    effects: {
        * removeConnections({payload}, {put, call}) {
            const res = yield call(removeConfig, payload.uid);
            const treeData = tree.render(res, payload.dispatch)
            if (res) {
                yield put({
                    type: 'save',
                    payload: {treeData}
                })
                return true;
            }
            return false;
        },

        * testConnection({payload}, {call, put}) {
            yield put({
                type: 'save',
                payload: {treeLoading: true}
            })
            yield call(RedisService.connect, payload);
        },

        * loadKeys({payload}, {call, put}) {
            const res = yield call(RedisService.fetchKeys, payload)
            yield put({
                type: 'save',
                payload: {keyData: res, keyList: res.slice(0, 10)}
            })
        },

        * getString({payload}, {call, put}) {
            const res = yield call(RedisService.getString, payload);
            yield put({
                type: 'save',
                payload: {
                    currentStringValue: res
                }
            })
        },

        * setString({payload}, {call, put}) {
            return yield call(RedisService.setString, payload);
        },

        * renameKey({payload}, {call, put}) {
            return yield call(RedisService.renameKey, payload);
        },

        * ttl({payload}, {call, put}) {
            const res = yield call(RedisService.ttl, payload);
            yield put({
                type: 'save',
                payload: {ttl: res}
            })
        },

        * expireKey({payload}, {call, put}) {
            let res;
            if (payload.seconds === "-1") {
                res = yield call(RedisService.persist, payload);
            } else {
                res = yield call(RedisService.expireKey, payload);
            }
            if (res === 1) {
                Toast.success(intl.get("common.success"))
                yield put({
                    type: 'save',
                    payload: {ttl: payload.seconds}
                })
                return true
            }
            Toast.error(intl.get("common.failed"))
            return false
        }
    }
}

export default Model;