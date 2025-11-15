const POLLING_INTERVAL = 500
import osUtils from 'os-utils'

export function pollResource() {
    setInterval(() => {getCpuUsage()}, POLLING_INTERVAL)
}

function getCpuUsage() {
    osUtils.cpuUsage((percentage) => console.log(percentage))
}