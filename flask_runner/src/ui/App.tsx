import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useStatistics } from "./useStatistics";
import { Chart } from "./Chart";

function App() {
	useEffect(() => {
		window.electron.subscribeStatistics((stats) => console.log(stats));
	});

	const [activeView, setActiveView] = useState<View>("CPU");

	const statistics = useStatistics(10);

	const cpuUsages = useMemo(
		() => statistics.map((stat) => stat.cpuUsage),
		[statistics]
	);
	const ramUsages = useMemo(
		() => statistics.map((stat) => stat.ramUsage),
		[statistics]
	);
	const storageUsages = useMemo(
		() => statistics.map((stat) => stat.storageUsage),
		[statistics]
	);
	const activeUsages = useMemo(() => {
		switch (activeView) {
			case "CPU":
				return cpuUsages;
			case "RAM":
				return ramUsages;
			case "STORAGE":
				return storageUsages;
		}
	}, [activeView, cpuUsages, ramUsages, storageUsages]);

	useEffect(() => {
		return window.electron.subscribeChangeView((view) =>
			setActiveView(view)
		);
	}, []);

	return (
		<>
			<Header />
			<div className='mainGrid'>
				<Chart
					selectedView={activeView}
					data={activeUsages}
					maxDataPoints={10}
				/>
			</div>
		</>
	);
}

function Header() {
	return (
		<header>
			<button
				id='close'
				onClick={() => window.electron.sendFrameAction("CLOSE")}
			/>
			<button
				id='minimize'
				onClick={() => window.electron.sendFrameAction("MINIMIZE")}
			/>
			<button
				id='maximize'
				onClick={() => window.electron.sendFrameAction("MAXIMIZE")}
			/>
		</header>
	);
}

export default App;
