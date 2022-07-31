enum LanguageProps {
    en = "en",
    zh = "zh"
}

export interface GlobalState {
    theme: string;
    language: LanguageProps;
}

export type GlobalModelType = {
    namespace: string;
    state: GlobalState;
    reducers: {
        save: any;
    }
}

const Model: GlobalModelType = {
    namespace: 'global',
    state: {
        theme: localStorage.getItem("pedis-theme") || 'light',
        language: LanguageProps.zh
    },
    reducers: {
        save(state: GlobalState, action: { payload: any }) {
            return {
                ...state,
                ...action.payload
            }
        }
    }
}

export default Model;