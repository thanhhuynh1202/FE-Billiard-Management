import { getCookie, setCookie } from 'cookies-next';
import {isBrowser } from './is-browser'

interface Options {
    normalize: boolean;
}

export const saveStorage = (key: string, value: string, options?: Options) => {
    if (!isBrowser) {
       return undefined;
    }

    value = options?.normalize ? JSON.stringify(value):value

    setCookie(key, value);

}

export const getStorage = (key: string) => {
    if (!isBrowser) {
        return undefined;
     }
     return getCookie(key)
  };