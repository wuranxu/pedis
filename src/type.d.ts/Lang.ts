import { StateProps } from "../models/connection";

export interface Lang {
    lang: string;
    setLang: Function;
    dispatch?: any;
    // connection?: StateProps;
}