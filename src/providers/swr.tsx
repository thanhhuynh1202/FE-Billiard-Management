'use client';

import { ReactNode } from "react"
import { SWRConfig as SWRConfigProvider } from "swr"

const SWRConfig = ({ children }: { children: ReactNode }) => {

    return <SWRConfigProvider 
        value={{
            refreshInterval: 3000,
        
            refreshWhenHidden: false,
            /**
             * polling when the browser is offline (determined by `navigator.onLine`)
             */
            refreshWhenOffline: false,
            /**
             * automatically revalidate when window gets focused
             * @defaultValue true
             * @link https://swr.vercel.app/docs/revalidation
             */
            revalidateOnFocus: false,
            /**
             * automatically revalidate when the browser regains a network connection (via `navigator.onLine`)
             * @defaultValue true
             * @link https://swr.vercel.app/docs/revalidation
             */
            revalidateOnReconnect: false,
            /**
             * enable or disable automatic revalidation when component is mounted
             */
            revalidateOnMount: false,
            /**
             * automatically revalidate even if there is stale data
             * @defaultValue true
             * @link https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
             */
            revalidateIfStale: true,
            /**
             * retry when fetcher has an error
             * @defaultValue true
             */
            shouldRetryOnError: false
            /**
             * keep the previous result when key is changed but data is not ready
             * @defaultValue false
             */
                // nhấn Ctrl roi click chuot vao value
            }
        }
>

    {children}

</SWRConfigProvider>
}

export default SWRConfig