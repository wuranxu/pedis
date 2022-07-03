import ConfigService, { removeConfig, writeConfig } from "../service/config";
import tree from "../utils/tree";

export interface ConnectionState {
    data?: string;
}


export default {
    namespace: 'connection',
    state: {
        treeData: [],
        originData: [],
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
        * removeConnections({ payload }, { put, call, select }) {
            // @ts-ignore
            const connection = yield select((state: { connection: any; }) => state.connection);
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
        }
    }
}