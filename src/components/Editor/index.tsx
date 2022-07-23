import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, {useEffect, useState} from 'react';
import "./index.css";
import {ThemeType} from "../../type.d.ts/theme";

interface EditorProps {
    editorRef: any;
    value: string;
    onSave?: any;
    options?: any;
    theme?: string | 'vs-dark';
    height?: string | '360';
    language?: string | 'json';
}


const Editor: React.FC<EditorProps> = (props: EditorProps) => {

    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

    const {editorRef: monacoEl} = props;

    useEffect(() => {
        if (monacoEl && !editor) {
            const editorNow = monaco.editor.create(monacoEl.current!, {
                value: props.value,
                language: props.language,
                automaticLayout: true,
                theme: props.theme === ThemeType.LIGHT ? 'vs-light' : 'vs-dark',
                selectOnLineNumbers: true,
                maxTokenizationLineLength: 10000,
            })
            setEditor(editorNow);
            monacoEl.editor = editorNow;
        }

        return () => editor?.dispose();
    }, [monacoEl?.current]);

    useEffect(() => {
        editor?.setValue(props.value)
    }, [props.value])

    useEffect(() => {
        console.log(props.theme)
        editor?.updateOptions({theme: props.theme === ThemeType.LIGHT ? 'vs-light' : 'vs-dark'})
    }, [props.theme])

    return (
        <div id="pedis-monaco" ref={monacoEl}>

        </div>
    );
}

export default Editor;