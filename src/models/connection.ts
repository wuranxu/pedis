export interface ConnectionState {
    data?: string;
}

export default {
    namespace: 'connection',
    state: {
        treeData: [],
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
        // * onTestConnection({payload} ,{call, put}) {
        //     yield call()
        // }
    }
}