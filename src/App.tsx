import * as echarts from "echarts";
import { get } from "lodash";
import { useEffect, useRef } from "react";
import ClonotypeBarChart from "./components/clonotype/barchart";
import ClonotypeHeatmap from "./components/clonotype/heatmap";
import ClonotypeMotif from "./components/clonotype/sequence-motif";
import ClonotypeViolin from "./components/clonotype/violin";
import Heatmap from "./components/heatmap/heatmap";
import InteractiveHeatmap from "./components/higlass/InteractiveHeatmap";
import Histogram from "./components/histogram";
import TableTest from "./components/table";
import data from "./data.json";
import SwarmChart from "./components/clonotype/swarmchart/SwarmChart";
import HeatmapMatrix from "./components/clustergrammarGL";
import HeatmapVT from "./components/vitessce/Heatmap";
import { expressionMatrix, cellColors } from "./components/vitessce/Heatmap.test.fixtures";

function App() {
	const graphicRef = useRef<any>();
	useEffect(() => {
		// onRender();
	}, []);
	const onRender = () => {
		const dom = document.getElementById("echarts");
		const myChart = echarts.init(dom, null, {
			renderer: "canvas",
			useDirtyRect: false,
			width: 948,
			height: 1000,
		});
		const scatterSeries = onCreateScatterSeries();
		const lineSeries = onCreateLineSeries();
		console.log("scatterSeries", scatterSeries);
		console.log("lineSeries", lineSeries);
		const option = {
			grid: {
				width: 500,
				height: 500,
			},
			xAxis: [
				{
					type: "value",
					min: -200,
					max: 150,
					interval: 50,
				},
			],
			yAxis: {
				type: "value",
				min: -50,
				max: 0,
				interval: 10,
			},
			series: [
				{
					z: 100,
					type: "scatter",
					symbolSize: 20,
					itemStyle: {
						// color: "red",
						opacity: 1,
					},
					data: scatterSeries,
				},
				// ...lineSeries,
			],
			visualMap: {
				seriesIndex: 0,
				min: 0,
				max: 100,
				calculable: true,
				realtime: false,
				inRange: {
					color: [
						"#313695",
						"#4575b4",
						"#74add1",
						"#abd9e9",
						"#e0f3f8",
						"#ffffbf",
						"#fee090",
						"#fdae61",
						"#f46d43",
						"#d73027",
						"#a50026",
					],
				},
			},
		};
		myChart.setOption(option);
		const threshold = myChart.convertToPixel({ xAxisIndex: 0 }, -100);
		const gridRect = getGridRect(myChart);
		const shape = {
			x1: threshold,
			y1: get(gridRect, ["y"]),
			x2: threshold,
			y2: get(gridRect, ["height"]) + 17,
		};
		const graphic = [
			{
				type: "line",
				name: "Drag to adjust the threshold for Log₂FC",
				shape: shape,
				draggable: "horizontal",
				cursor: "ew-resize",
				ondrag: (params: any) => {
					console.log("params", params);
					const pos = params.target.shape?.x1 + params.target.transform?.[4];
					if (pos < threshold) return;
					myChart.setOption({
						graphic: [
							graphicRef.current[0],
							{
								type: "rect",
								shape: {
									x: pos,
									y: get(gridRect, ["y"]),
									width: get(gridRect, ["width"]) - pos,
									height: get(gridRect, ["height"]),
								},
								style: {
									fill: "#71a3c1",
									opacity: 0.5,
								},
							},
						],
					});
					// let newLog2Fc =
					//     instance?.convertFromPixel('grid', [pos, 0])?.[0] ||
					//     0;
				},
				// ondragend: (params: any) => {
				//     const pos =
				//         params.target.shape?.x1 +
				//         params.target.transform?.[4];
				//     const instance =
				//         echartRef.current?.getEchartsInstance();
				//     let newLog2Fc =
				//         instance?.convertFromPixel('grid', [
				//             pos,
				//             0
				//         ])?.[0] || 0;
				//     if (Number.isNaN(newLog2Fc)) {
				//         newLog2Fc = 0;
				//     }
				//     if (newLog2Fc < xmin) {
				//         newLog2Fc = xmin;
				//     } else if (newLog2Fc > 0) {
				//         newLog2Fc = 0;
				//     }
				//     onDragLog2FcEnd(newLog2Fc, 1);
				// },
				style: {
					stroke: "#000000A6",
					lineWidth: 1,
				},
				z: 9999,
			},
			{
				type: "rect",
				shape: {
					x: threshold,
					y: get(gridRect, ["y"]),
					width: get(gridRect, ["width"]) - threshold,
					height: get(gridRect, ["height"]),
				},
				style: {
					fill: "#71a3c1",
					opacity: 0.5,
				},
			},
		];
		graphicRef.current = graphic;
		myChart.setOption({
			graphic,
		});
	};
	const getGridRect = (instance: EChartsInstance) => {
		return get(instance, ["_coordSysMgr", "_coordinateSystems", "0", "_rect"]);
	};

	const onCreateScatterSeries = () => {
		return Object.values(data.nodes)?.map((item) => {
			return {
				value: item,
			};
		});
	};

	const onCreateLineSeries = () => {
		return Object.entries(data.edges)?.reduce((pre, current) => {
			const [source, targets] = current;
			const sourceCoord = data?.nodes[source];
			// const lineSeries = {
			// 	data: [
			// 		[-100, -10],
			// 		[-50, -30],
			// 	],
			// 	symbol: "none",
			// 	itemStyle: {
			// 		color: "black",
			// 	},
			// 	type: "line",
			// };
			targets?.forEach((target) => {
				const targetCoord = data.nodes[target];
				pre.push({
					data: [sourceCoord, targetCoord],
					symbol: "none",
					itemStyle: {
						color: "black",
					},
					type: "line",
				});
			});
			return pre;
		}, []);
	};

	// return <InteractiveHeatmap />;
	// return <Heatmap />;
	// return <Histogram />;
	// return <div id="echarts" />;
	// return <TableTest />;
	// return <ClonotypeHeatmap />;
	// return <ClonotypeBarChart />;
	// return <ClonotypeViolin />;
	// return <ClonotypeMotif />;
	// return <SwarmChart />;
	// return <HeatmapMatrix />;
	return <Vitessce config={myViewConfig} height={800} theme="light" />;
	// return (
	// 	<HeatmapVT
	// 		uuid="heatmap-0"
	// 		theme="dark"
	// 		width={100}
	// 		height={100}
	// 		colormap="plasma"
	// 		colormapRange={[0.0, 1.0]}
	// 		expressionMatrix={expressionMatrix}
	// 		cellColors={cellColors}
	// 		transpose
	// 		viewState={{ zoom: 0, target: [0, 0] }}
	// 	/>
	// );
}

export default App;
