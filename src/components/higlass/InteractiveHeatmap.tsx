import { ChromosomeInfo, HiGlassComponent, viewer } from "higlass";

const viewConfig = {
	editable: true,
	zoomFixed: false,
	trackSourceServers: ["/api/v2", "http://higlass.io/api/v1"],
	exportViewUrl: "/api/v1/viewconfs/",
	views: [
		{
			tracks: { top: [], left: [], center: [], right: [], bottom: [] },
			initialXDomain: [243883495.14563107, 2956116504.854369],
			initialYDomain: [804660194.1747572, 2395339805.825243],
			layout: {
				w: 12,
				h: 12,
				x: 0,
				y: 0,
				i: "EwiSznw8ST2HF3CjHx-tCg",
				moved: false,
				static: false,
			},
			uid: "EwiSznw8ST2HF3CjHx-tCg",
		},
	],
	zoomLocks: { locksByViewUid: {}, locksDict: {} },
	locationLocks: { locksByViewUid: {}, locksDict: {} },
	valueScaleLocks: { locksByViewUid: {}, locksDict: {} },
};
const options = { bounded: true };
const InteractiveHeatmap = () => {
	const chromInfo = ChromosomeInfo(
		"http://higlass.io/api/v1/chrom-sizes/?id=Ajn_ttUUQbqgtOD4nOt-IA",
		(chromInfo) => {
			console.log("chromInfo:", chromInfo);
		},
	);
	const hgv = hglib.viewer(document.getElementById("test"), viewConfig, {
		bounded: true,
	});
	// return <HiGlassComponent options={options} viewConfig={viewConfig}></HiGlassComponent>;
	return <div id="test"></div>;
};
export default InteractiveHeatmap;
