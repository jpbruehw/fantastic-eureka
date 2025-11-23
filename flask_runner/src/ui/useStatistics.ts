/**
 * What this hook is doing is registering the listener with the IPC
 * We are essentially creating and passing in the callback that will be executed
 * This is like adding an event listener to something
 * This is a really common pattern for dealing with subscriptions and logic like that
 * So when the component mounts, it cleans it up by running unsub()
 * Like:
 * subscribeStatistics(listener)  
 *   -> REGISTER listener internally  
 *   -> RETURN a different function (unsubscribe)
 * 
 * More info: https://react.dev/reference/react/useEffect#connecting-to-an-external-system
 */

import { useEffect, useState } from 'react';

export function useStatistics(dataPointCount: number): Statistics[] {
    const [value, setValue] = useState<Statistics[]>([]);

    useEffect(() => {
        const unsub = window.electron.subscribeStatistics((stats) =>
            setValue((prev) => {
                const newData = [...prev, stats];
                // we add to end of the array
                // so we can get rid of first item
                if (newData.length > dataPointCount) {
                    newData.shift();
                }

                return newData;
            })
        );
        return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return value;
}