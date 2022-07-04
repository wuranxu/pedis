import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'
import "./index.css"
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';

import {LocaleProvider} from '@douyinfe/semi-ui';
import Locale from './components/Locale';
import dva from 'dva';

const LocaleApp = () => {

    const [language, setLanguage] = useState<string>("zh");
    const [locale, setLocale] = useState(zh_CN);

    useEffect(() => {
        if (language === 'zh') {
            setLocale(zh_CN)
        } else {
            setLocale(en_GB)
        }

    }, [language])

    return (
        <Locale locale={language}>
            <LocaleProvider locale={locale}>
                <App lang={language} setLang={setLanguage}/>
            </LocaleProvider>
        </Locale>
    );
}

const app = dva();
import connection from './models/connection';
app.model(connection);
app.router(() => <LocaleApp />);

// 5. Start
app.start('#root');

// ReactDOM.createRoot(document.getElementById('root')!).render(
//     <LocaleApp/>
// )
