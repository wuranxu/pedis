type ConfigMap = {
    [key: string]: string | boolean | number | object;
}

export const Config: ConfigMap = {
    CONFIG_FILE: "config.json",
}