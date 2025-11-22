import { useEffect } from "react";

export function useStatistics(){
    useEffect(() => {
        const unsub = window.electron.subscribeStatistics((stats) => {
            console.log(stats)
        })
        return unsub
    }, [])
}