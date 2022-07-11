import { Value } from "@douyinfe/semi-ui/lib/es/tree";
import { Effect } from "dva";
import { removeConfig } from "../service/config";
import RedisService from "../service/redis";
import tree from "../utils/tree";

export interface ConnectionState {
    data?: string;
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
    redisKeys:Map<number, number>;
}

export type ConnectionModelType = {
    namespace: string;
    state: StateProps;
    effects: {
        removeConnections: Effect;
        testConnection: Effect;
    };
    reducers: {
        save: any;
        updateConnectionStatus: any;
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
        redisKeys: new Map<number, number>()
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
        }
    },

    effects: {
        * removeConnections({ payload }, { put, call }) {
            const res = yield call(removeConfig, payload.uid);
            const treeData = tree.render(res, payload.dispatch)
            if (res) {
                yield put({
                    type: 'save',
                    payload: { treeData }
                })
                return true;
            }
            return false;
        },

        * testConnection({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload: { treeLoading: true }
            })
            yield call(RedisService.connect, payload);
        }
    }
}

export default Model;