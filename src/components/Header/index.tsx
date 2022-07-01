import { IconLanguage } from '@douyinfe/semi-icons';
import { IconGithubLogo, IconMoon, IconSun } from '@douyinfe/semi-icons';
import { Avatar, Button, Dropdown, Nav, Space } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { Lang } from '../../type.d.ts/Lang';

enum ThemeType {
    LIGHT = "light",
    DARK = "dark"
}



export default (lang: Lang) => {

    const getTheme = () => {
        // get theme, default light
        return localStorage.getItem("pedis-theme") || ThemeType.LIGHT
    }

    const [mode, setMode] = useState<string>(getTheme());

    useEffect(() => {
        const theme = getTheme()
        if (theme === ThemeType.LIGHT) {
            document.body.removeAttribute("theme-mode");
        } else {
            document.body.setAttribute("theme-mode", ThemeType.DARK);
        }
    }, [])

    const onSwitchMode = () => {
        const body = document.body;
        if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');
            setMode(ThemeType.LIGHT);
            localStorage.setItem("pedis-theme", 'light')
        } else {
            body.setAttribute('theme-mode', ThemeType.DARK);
            setMode(ThemeType.DARK);
            localStorage.setItem("pedis-theme", ThemeType.DARK)
        }
    }

    return (
        <Nav
            mode='horizontal'
            header={{
                logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
                text: 'Pedis'
            }}
            footer={
                <Space spacing={[24, 16]}>
                    <Button type="tertiary" theme='borderless' icon={<IconGithubLogo />}>
                        Github
                    </Button>
                    <Button type="primary" theme='borderless'>
                        系统设置
                    </Button>
                    <Button icon={
                        mode === 'dark' ? <IconSun style={{ color: '#9C27B0' }} /> : <IconMoon style={{ color: '#6700ff' }} />
                    } onClick={() => {
                        onSwitchMode()
                    }}>
                    </Button>
                    <Button type="tertiary" theme="borderless"
                        onClick={() => {
                            lang.setLang(lang.lang === "zh" ? 'en' : 'zh')
                        }}
                        icon={<IconLanguage style={{ color: "#333" }} />}>
                        {lang.lang === 'zh' ? 'EN': '中文'}
                    </Button>
                    {/* <Dropdown
                        position="bottomRight"
                        render={
                            <Dropdown.Menu>
                                <Dropdown.Item>详情</Dropdown.Item>
                                <Dropdown.Item>退出</Dropdown.Item>
                            </Dropdown.Menu>
                        }
                    >
                        <Avatar size="small" color='light-blue' style={{ margin: 4 }}>BD</Avatar>
                        <span>联系作者</span>
                    </Dropdown> */}
                </Space>
            }
        />
    )
}