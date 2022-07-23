import {connect} from "dva";
import {useEffect} from "react";
import {ConnectState} from "../../models/connect";
import {StateProps} from "../../models/connection";
import Editor from "../Editor";
import {GlobalState} from "../../models/global";

interface StringKeyProps {
    connection: StateProps;
    global: GlobalState;
    key: string;
    dispatch: any;
    loading: any;
    editorRef: any;
}

const StringKey: React.FC<StringKeyProps> = ({
                                                 key,
                                                 connection,
                                                 loading,
                                                 global,
                                                 dispatch,
                                                 editorRef
                                             }: StringKeyProps) => {

    const {redisConn, currentStringValue, currentSelectedKey} = connection;
    const {theme} = global;

    useEffect(() => {
        dispatch({
            type: 'connection/getString',
            payload: {
                redis: redisConn, key: currentSelectedKey.key
            }
        })
    }, [currentSelectedKey.key])


    return (
        <Editor value={currentStringValue} language="text" editorRef={editorRef} theme={theme}/>
    )
}

export default connect(({connection, loading, global}: ConnectState) => ({connection, loading, global}))(StringKey);