import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import { useEffect, useState } from 'react';
import "./index.css";
import App from './pages/App';
import '@icon-park/react/styles/index.css';
// @ts-ignore
import createLoading from 'dva-loading';

import { LocaleProvider } from '@douyinfe/semi-ui';
import dva from 'dva';
import Locale from './components/Locale';
import connection from './models/connection';
import global from './models/global';
import './userWorker';

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
                <App language={{ lang: language, setLang: setLanguage }} />
            </LocaleProvider>
        </Locale>
    );
}

const app = dva(createLoading());
app.model(connection);
app.model(global)
app.router(() => <LocaleApp />);

// 5. Start
app.start('#root');

// ReactDOM.createRoot(document.getElementById('root')!).render(
//     <LocaleApp/>
// )
