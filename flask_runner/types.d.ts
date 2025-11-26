// all types we share between front and back end
// this is essentially a contract between the front and back end for types

type Statistics = {
	cpuUsage: number;
	ramUsage: number;
	storageUsage: number;
};

type StaticData = {
	totalStorage: number;
	cpuModel: string;
	totalMemoryGB: number;
};

type View = "CPU" | "RAM" | "STORAGE";

type FrameWindowAction = "CLOSE" | "MAXIMIZE" | "MINIMIZE";

// mapping types
type EventPayloadMapping = {
	statistics: Statistics;
	getStaticData: StaticData;
	changeView: View;
	sendFrameAction: FrameWindowAction;
};

type UnsubscribeFunction = () => void;

interface Window {
	electron: {
		subscribeStatistics: (
			callback: (statistics: Statistics) => void
		) => UnsubscribeFunction;
		getStaticData: () => Promise<StaticData>;
		subscribeChangeView: (
			callback: (view: View) => void
		) => UnsubscribeFunction;
		sendFrameAction: (payload: FrameWindowAction) => void;
	};
}
