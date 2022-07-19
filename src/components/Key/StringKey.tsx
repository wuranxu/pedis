import { connect } from "dva";
import { useEffect } from "react";
import { ConnectState } from "../../models/connect";
import { StateProps } from "../../models/connection";


interface StringKeyProps {
    connection: StateProps;
    key: string;
    dispatch: any;
    loading: any;
}

const StringKey: React.FC = ({ key, connection, loading, dispatch }: StringKeyProps) => {

    const { redisConn, currentStringValue, currentSelectedKey } = connection;

    useEffect(() => {
        console.log("寄你太美")
        dispatch({
            type: 'connection/getString',
            payload: {
                redis: redisConn, key: currentSelectedKey.key
            }
        })
    }, [])

    return (
        <div>{currentStringValue}</div>
    )
}

export default connect(({ connection, loading }: ConnectState) => ({ connection, loading }))(StringKey);