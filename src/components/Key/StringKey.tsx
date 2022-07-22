import { connect } from "dva";
import { useEffect } from "react";
import { ConnectState } from "../../models/connect";
import { StateProps } from "../../models/connection";
import Editor from "../Editor";

interface StringKeyProps {
    connection: StateProps;
    key: string;
    dispatch: any;
    loading: any;
    editorRef: any;
}

const StringKey: React.FC<StringKeyProps> = ({ key, connection, loading, dispatch, editorRef }: StringKeyProps) => {

    const { redisConn, currentStringValue, currentSelectedKey } = connection;

    useEffect(() => {
        dispatch({
            type: 'connection/getString',
            payload: {
                redis: redisConn, key: currentSelectedKey.key
            }
        })
    }, [currentSelectedKey.key])


    return (
        <Editor value={currentStringValue} language="text" editorRef={editorRef} />
    )
}

export default connect(({ connection, loading }: ConnectState) => ({ connection, loading }))(StringKey);