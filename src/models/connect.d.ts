import type { ConnectionState } from './connection';

export { ConnectionState };

export type Loading = {
    global: boolean;
    effects: Record<string, boolean | undefined>;
    models: {
        connection?: boolean;
    };
};

export type ConnectState = {
    connection: ConnectionState,
    loading: Loading;
};
