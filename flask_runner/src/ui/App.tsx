import { useEffect } from 'react'
import './App.css'

function App() {

    useEffect(() => {
        window.electron.subscribeStatistics(stats => console.log(stats))
    })
  return (
    <>
    ten
    </>
  )
}

export default App
