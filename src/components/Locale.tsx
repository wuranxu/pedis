(window as any).global = window;

import intl from 'react-intl-universal';
// common locale data
import 'intl/locale-data/jsonp/en.js';
import 'intl/locale-data/jsonp/zh.js';
import en from '../../public/locale/en.json';
import zh from '../../public/locale/zh.json';


const localesMap: any = {
    "en": en,
    "zh": zh,
};

export default (props: any) => {
    intl.init({
        currentLocale: props.locale,
        locales: {
            [props.locale]: localesMap[props.locale],
        }
    })

    return (
        <div>
            {props.children}
        </div>
    )
}