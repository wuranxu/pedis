import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'
import "./index.css"
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';

import { LocaleProvider } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';

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
    <LocaleProvider locale={locale}>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <App lang={language} setLang={setLanguage} />
    </LocaleProvider>
  );
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <LocaleApp />
)
