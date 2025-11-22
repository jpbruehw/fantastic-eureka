import { useEffect } from 'react'
import './App.css'
import { useStatistics } from './useStatistics'

function App() {

    useEffect(() => {
        window.electron.subscribeStatistics(stats => console.log(stats))
    })

    const statistics = useStatistics(10)
    console.log(statistics)

    return (
        <>
        </>
    )
}

export default App
