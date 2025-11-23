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