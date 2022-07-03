import { Toast } from "@douyinfe/semi-ui";
import intl from 'react-intl-universal';
import { Config } from "../utils/constants";

const path = window.require("path");
const fs = window.require("fs");

export default class ConfigService {

    static async getConfigFile() {
        // get user data directory
        // @ts-ignore
        const userDataPath = await window.ipcRenderer.invoke("get-file-path")
        return `${userDataPath}${path.sep}${Config.CONFIG_FILE}`
    }

    static async readConfig(filePath?: string | undefined) {
        if (filePath === undefined) {
            filePath = await this.getConfigFile();
        }
        try {
            const stats = fs.existsSync(filePath);
            if (!stats) {
                return [];
            }
            const data: string = fs.readFileSync(filePath, 'utf-8')
            return JSON.parse(data);
        } catch (e) {
            console.log(e)
            Toast.warning(intl.get("file.read_config.error"))
            return [];
        }
    }

    static async writeConfig(nodes: Array<any>) {
        console.log(nodes)
        const filePath = await this.getConfigFile();
        try {
            fs.writeFileSync(filePath, JSON.stringify(nodes, null, 2), "utf-8");
            return true;
        } catch (e) {
            console.log(e)
            Toast.warning(intl.get("file.save_config.error"))
            return false;
        }
    }

}

export async function writeConfig(nodes: any) {
    const filePath = await ConfigService.getConfigFile();
    try {
        fs.writeFileSync(filePath, JSON.stringify(nodes, null, 2), "utf-8");
        return true;
    } catch (e) {
        console.log(e)
        Toast.warning(intl.get("file.save_config.error"))
        return false;
    }
}

export async function removeConfig(key: string) {
    const filePath = await ConfigService.getConfigFile();
    const data = await ConfigService.readConfig(filePath);
    const now = data.filter((item: any) => key !== item.key)
    try {
        fs.writeFileSync(filePath, JSON.stringify(now, null, 2), "utf-8");
        return now;
    } catch (e) {
        Toast.warning(intl.get("file.save_config.error"))
        return data;
    }
}

