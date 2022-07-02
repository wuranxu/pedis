import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'
import "./index.css"
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';

import {LocaleProvider} from '@douyinfe/semi-ui';
import Locale from './components/Locale';

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


ReactDOM.createRoot(document.getElementById('root')!).render(
    <LocaleApp/>
)
