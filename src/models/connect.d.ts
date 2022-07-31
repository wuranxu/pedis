import type {ConnectionState} from './connection';
import type {GlobalState} from './global';

export {ConnectionState};

export type Loading = {
    global: boolean;
    effects: Record<string, boolean | undefined>;
    models: {
        connection?: boolean;
    };
};

export type ConnectState = {
    connection?: ConnectionState,
    global?: GlobalState,
    loading: Loading;
};
