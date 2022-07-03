import { Toast } from "@douyinfe/semi-ui";
import intl from 'react-intl-universal';
import { removeConfig } from "../service/config";
import RedisService from "../service/redis";
import tree from "../utils/tree";
const Redis = window.require("ioredis");

export interface ConnectionState {
    data?: string;
}


export default {
    namespace: 'connection',
    state: {
        treeData: [],
        originData: [],

        // current data
        currentConnection: {},

        // visible
        visible: false,
    
    },

    reducers: {
        save(state: ConnectionState, action: { payload: any }) {
            return {
                ...state,
                ...action.payload,
            }
        },
    },

    effects: {
        // @ts-ignore
        * removeConnections({ payload }, { put, call }) {
            // @ts-ignore
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

        // @ts-ignore
        * testConnection({ payload }, { call, put }) {
            yield call(RedisService.connect, payload);
        }
    }
}