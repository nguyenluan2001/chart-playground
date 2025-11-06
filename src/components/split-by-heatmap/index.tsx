import * as echarts from "echarts";
import { flattenDeep, groupBy, isEmpty, sum } from "lodash";
import { useEffect, useRef } from "react";
import data from "./data.json";
import heatmapData from "./heatmap.json";
import { hierarchy } from "d3";

const GRID_LEFT = 100;
const GROUP_LEGEND_WIDTH = 15;
const CHART_WIDTH = 500;
const categoryColors = [
	"#688ae8",
	"#c33d69",
	"#2ea597",
	"#8456ce",
	"#e07941",
	"#3759ce",
	"#962249",
	"#096f64",
	"#6237a7",
	"#a84401",
	"#273ea5",
	"#780d35",
	"#03524a",
	"#4a238b",
	"#7e3103",
	"#1b2b88",
	"#ce567c",
	"#003e38",
	"#9469d6",
	"#602400",
	"#4066df",
	"#a32952",
	"#0d7d70",
	"#6b40b2",
	"#bc4d01",
	"#2c46b1",
	"#81143b",
	"#045b52",
	"#512994",
	"#8a3603",
	"#1f3191",
	"#da7596",
	"#01443e",
	"#a783e1",
	"#692801",
	"#5978e3",
	"#b1325c",
	"#1c8e81",
	"#7749bf",
	"#cc5f21",
	"#314fbf",
	"#8b1b42",
	"#06645a",
	"#59309d",
	"#983c02",
	"#23379b",
	"#6f062f",
	"#014b44",
	"#431d84",
	"#732c02",
];
const expressionColors = [
	// "#ffffcc",
	// "#ffeda0",
	// "#fed976",
	"#feb24c",
	"#fd8d3c",
	"#fc4e2a",
	"#e31a1c",
	"#bd0026",
	"#800026",
];
// const splitBy = {
// 	"Metadata 2": {
// 		cols: [1, 2, 1, 1, 1, 1, 1, 1, 1],
// 		stride: 3,
// 	},
// 	"Metadata 1": {
// 		cols: [4, 3, 3],
// 		stride: 1,
// 	},
// };

const splitBy = {
	"Metadata 1": {
		cols: [103, 103, 119, 433, 119, 56, 5, 58],
		stride: 1,
	},
	"Metadata 2": {
		cols: [
			50,
			50,
			3, //Group 1
			50,
			30,
			23, //Group 2
			50,
			50,
			19, //Group 3
			100,
			200,
			133, //Group 4
			40,
			40,
			39, //Group 5
			20,
			20,
			36, //Group 6
			1,
			2,
			3, //Group 7
			10,
			30,
			18, //Group 8
		],
		stride: 3,
	},
};

const MAX_CELL_HEIGHT = 50;
const MIN_CELL_HEIGHT = 20;
const MAX_X_AXIS_HEIGHT = 280;
const MAX_Y_AXIS_WIDTH = 100;
const MAX_LEGEND_WIDTH = 120;
const CLUSTER_GAP = 0;
const MAX_CLUSTER_GROUP_HEIGHT = 25;
const GAP_HEATMAP_VS_CLUSTER = 2;
const INIT_EXP_RANGE = {
	min: 1e4,
	max: -1,
};
const EXP_LEVEL_BREAKPOINTS = 6;

const SplitByHeatmap = () => {
	console.log(data);
	const expRangeRef = useRef({
		min: 1e4,
		max: -1,
	});
	const containerDimension = {
		width: 2000,
		height: 500,
	};
	const chartWidth = 1500;
	useEffect(() => {
		// onRender();
		renderHeatmapChart(expressionColors);
	}, []);

	const calculateClusterWidth = (totalCol, cols) => {
		return (chartWidth / totalCol) * cols;
	};

	const createSeriesData = (metadata: string, totalCol: number, cols: number[], stride: number) => {
		const seriesData = [];
		const visualMapPieces = [];
		let sum = 0;

		for (let i = 0; i < cols.length; i++) {
			let center = 0;
			if (i === 0) {
				center = cols[i] / 2;
			} else {
				center = sum + cols[i] / 2;
			}
			sum += cols[i];
			seriesData.push({
				value: [center, metadata, cols[i]],
				symbolSize: [calculateClusterWidth(totalCol, cols[i]), 10],
			});
			visualMapPieces.push({
				value: center,
				color: stride === 1 ? categoryColors[i] : categoryColors[i % stride],
			});
		}
		return { seriesData, visualMapPieces };
	};

	const createSeries = (totalCol, nGroup) => {
		const series = [];
		const visualMap = [];

		let count = clusters.length;
		for (const metadata in splitBy) {
			const cols = splitBy[metadata].cols;
			const stride = splitBy[metadata].stride;
			const { seriesData, visualMapPieces } = createSeriesData(metadata, totalCol, cols, stride);
			series.push({
				type: "scatter",
				symbol: "rect",
				colorBy: "data",
				emphasis: {
					disabled: true,
				},
				data: seriesData,
				gridIndex: nGroup,
				xAxisIndex: nGroup,
				yAxisIndex: nGroup,
			});
			visualMap.push({
				show: false,
				type: "piecewise",
				calculable: false,
				realtime: false,
				seriesIndex: count,
				dimension: 0,
				pieces: visualMapPieces,
			});
			count++;
		}
		return { series, visualMap };
	};

	const createGroupDivider = (
		cols: number[],
		totalCol: number,
		gridTop: number,
		gridHeight: number,
	) => {
		let offset = 0;
		const graphic = [];
		cols?.forEach((col, index) => {
			if (col === 0) return;
			const chromosomeWidth = (chartWidth / totalCol) * col;
			const chromGraphic = {
				type: "group",
				left: MAX_Y_AXIS_WIDTH + chromosomeWidth + offset - 2,
				// left: MAX_Y_AXIS_WIDTH - 2,
				top: -2,
				width: chromosomeWidth,
				children: [
					{
						type: "polyline",
						y: 0,
						x: 0,
						z: 300,
						shape: {
							points: [
								[0, 0],
								[0, gridHeight],
							],
						},
						style: {
							stroke: "#ffffff",
							lineWidth: 2,
						},
					},
				],
			};
			graphic.push(chromGraphic);
			offset += chromosomeWidth;
		});
		return graphic;
	};

	const onRender = () => {
		const dom = document.getElementById("echarts");
		const myChart = echarts.init(dom, null, {
			renderer: "canvas",
			useDirtyRect: false,
			width: 1200,
			height: 1000,
		});
		// const { seriesData, minExp, maxExp } = createSeriesData();
		const { series, visualMap } = createSeries();
		console.log("🚀 ===== onRender ===== series:", series);
		console.log("🚀 ===== onRender ===== visualMap:", visualMap);
		const option: echarts.EChartsOption = {
			animation: false,
			grid: {
				width: CHART_WIDTH,
				height: 40,
				left: GRID_LEFT,
			},
			xAxis: {
				type: "value",
				min: 0,
				max: 10,
				interval: 1,
				axisLabel: {
					show: true,
					hideOverlap: false,
					interval: 0,
				},
				minorTick: {
					show: true,
				},
			},
			yAxis: [
				{
					type: "category",
					axisLabel: {
						fontSize: 11,
					},
					data: ["Metadata 2", "Metadata 1"],
				},
			],

			series,
			visualMap,
		};
		console.log("option", option);
		myChart.setOption(option);
		myChart.on("brushSelected", (params) => {
			console.log("params", params);
		});
	};

	// === RENDER HEATMAP CHART ===
	const clusters = [
		"111",
		"B cells",
		"CD14+ Monocytes",
		"CD4 T cells",
		"CD8 T cells",
		"FCGR3A+ Monocytes",
		"Megakaryocytes",
		"NK cells",
	];

	const getLengthInPx = (length: number) => length * 7;
	const renderHeatmapChart = (geneColors: string[]) => {
		const el = document.querySelector("#genesExpressionHeatmap0");
		echarts.dispose(el as HTMLElement);

		let isUseMinSize = false;

		let maxXAxisLen = 0;
		const validClusterNames = clusters?.map((cluster) => {
			maxXAxisLen = Math.max(maxXAxisLen, cluster?.length);
			return cluster;
		});

		const maxXAxisLenPx = Math.max(getLengthInPx(maxXAxisLen), 100);

		const validGenes = ["CD3D"];

		const { series, xAxis, yAxis, totalCol } = createHeatmapData(validClusterNames);

		let gridHeight = validGenes?.length * MAX_CELL_HEIGHT;
		if (gridHeight + MAX_CELL_HEIGHT > containerDimension.height) {
			gridHeight = validGenes?.length * MIN_CELL_HEIGHT;
			isUseMinSize = true;
		}

		const grid = createGrid(
			gridHeight,
			xAxis,
			validClusterNames.length,
			// (chartWidth - 400) / totalCol,
			chartWidth / totalCol,
		);
		console.log("🚀 ===== renderHeatmapChart ===== grid:", grid, chartWidth / totalCol, totalCol);
		const gridWidth = grid?.reduce((pre, current) => {
			pre = pre + current.width;
			return pre;
		}, 0);

		const { series: seriesCluster, visualMap: visualMapCluster } = createSeries(
			totalCol,
			grid.length,
		);
		const groupDivider = createGroupDivider(
			splitBy["Metadata 1"].cols,
			totalCol,
			0,
			gridHeight + MAX_CLUSTER_GROUP_HEIGHT + GAP_HEATMAP_VS_CLUSTER,
		);
		console.log("🚀 ===== renderHeatmapChart ===== visualMapCluster:", visualMapCluster);
		console.log("🚀 ===== renderHeatmapChart ===== seriesCluster:", seriesCluster);

		var option: echarts.EChartsOption = {
			legend: {
				show: false,
			},
			grid: [
				...grid,
				{
					width: chartWidth,
					height: MAX_CLUSTER_GROUP_HEIGHT,
					left: MAX_Y_AXIS_WIDTH,
					top: 0,
				},
			],
			xAxis: [
				...xAxis?.map((data, index) => {
					return {
						type: "category",
						data: data,
						position: "top",
						gridIndex: index,
						axisLabel: {
							show: false,
							interval: 0,
							rotate: 45,
							height: MAX_X_AXIS_HEIGHT,
							formatter: (value: any, index: number) => {
								if (isNaN(value)) return `${value} -${index}`;
								return "";
							},
						},
						axisTick: {
							show: false,
						},
						axisLine: {
							show: false,
						},
					};
				}),
				{
					type: "value",
					min: 0,
					max: totalCol,
					interval: 1,
					axisLabel: {
						show: false,
						hideOverlap: false,
						interval: 0,
					},
					axisLine: {
						show: false,
					},
					splitLine: {
						show: false,
					},
					splitArea: {
						show: false,
					},
					minorTick: {
						show: false,
					},
					gridIndex: grid.length,
				},
				// ...validClusterNames?.map((item, index) => {
				// 	return {
				// 		triggerEvent: true,
				// 		type: "category",
				// 		data: [0, item, 1], // Data visibility: [hidden, show, hidden]
				// 		position: "top",
				// 		gridIndex: index,
				// 		axisLabel: {
				// 			interval: 0,
				// 			rotate: -45,
				// 			fontSize: "10px",
				// 			width: MAX_X_AXIS_HEIGHT,
				// 			height: 20,
				// 			overflow: "break",
				// 			ellipsis: "...",
				// 			formatter: (value: any, index: number) => {
				// 				if (index == 1) return value;
				// 				return "";
				// 			},
				// 		},
				// 		axisTick: {
				// 			show: false,
				// 		},
				// 		axisLine: {
				// 			show: false,
				// 		},
				// 	};
				// }),
			],
			yAxis: [
				...grid?.map((data, index) => {
					return {
						type: "category",
						gridIndex: index,
						data: yAxis,
						position: "left",
						axisLabel: {
							show: index === 0,
						},
						axisTick: {
							show: false,
						},
						axisLine: {
							show: false,
						},
					};
				}),
				{
					type: "category",
					axisLabel: {
						fontSize: 8,
					},
					data: ["Metadata 2", "Metadata 1"],
					gridIndex: grid.length,
					axisTick: {
						show: false,
					},
					axisLine: {
						show: false,
					},
				},
				// ...grid?.map((item, index) => {
				// 	return {
				// 		type: "category",
				// 		gridIndex: index,
				// 		data: yAxis,
				// 		position: "left",
				// 		axisLabel: {
				// 			show: false,
				// 		},
				// 		axisTick: {
				// 			show: false,
				// 		},
				// 		axisLine: {
				// 			show: false,
				// 		},
				// 	};
				// }),
			],
			series: [...series, ...seriesCluster],
			visualMap: [
				{
					show: false,
					text: [1, 0],
					min: expRangeRef.current.min,
					max: expRangeRef.current.max,
					precision: 2,
					inRange: {
						color: geneColors,
					},
					dimension: "2",
					orient: "horizontal",
					left: "center",
					bottom: "5%",
					series: xAxis?.map((item, index) => index),
				},
				...visualMapCluster,
			],
			graphic: groupDivider,
		};
		const myChart = echarts.init(el as HTMLElement, null, {
			height: gridHeight + Math.min(maxXAxisLenPx, MAX_X_AXIS_HEIGHT) * (Math.sqrt(2) / 2),
			width: gridWidth + 200,
		});
		console.log("🚀 ===== renderHeatmapChart ===== gridWidth:", gridWidth);
		myChart.setOption(option);
		console.log("🚀 ===== renderHeatmapChart ===== option:", option);
	};

	const createHeatmapData = (validClusterNames: string[]) => {
		const groupData = groupBy([...(heatmapData || [])], "feature");
		const sortedData = flattenDeep(Object.values(groupData).reverse());
		const data = groupBy(sortedData, "node");
		const seriesByClusters = [];
		const xAxisByClusters = [];

		let totalCol = 0;

		const dataEntries = Object.entries(data)?.filter((item) => {
			const [clusterName] = item;
			return validClusterNames?.includes(clusterName);
		});

		for (let i = 0; i < dataEntries?.length; i++) {
			const [clusterName, geneData] = dataEntries[i];
			const { seriesData, xAxis } = createGridSeries(geneData);
			seriesByClusters.push({
				type: "heatmap",
				data: seriesData,
				xAxisIndex: [i],
				yAxisIndex: [i],
				tooltip: {
					trigger: "item",
				},
				progressive: 0,
			});
			xAxisByClusters?.push(xAxis);
			totalCol += xAxis?.length;
		}

		const yAxis = ["CD3D"];

		return {
			series: seriesByClusters,
			xAxis: xAxisByClusters,
			yAxis: yAxis.reverse(),
			totalCol,
		};
	};

	const createGridSeries = (data: any[]) => {
		const seriesData: any = [];
		const xAxis: any = [];
		data?.forEach((geneData) => {
			(geneData?.data as number[])?.forEach((cell: number, cellIdx: number) => {
				seriesData.push({
					value: [cellIdx, geneData?.feature, cell],
				});
				expRangeRef.current.min = Math.min(expRangeRef.current.min, cell);
				expRangeRef.current.max = Math.max(expRangeRef.current.max, cell);
				if (!xAxis?.includes(cellIdx)) {
					xAxis?.push(cellIdx);
				}
			});
		});
		return { seriesData, xAxis };
	};

	const createGrid = (
		gridHeight: number,
		colList: number[][],
		clusterLen: number,
		colWidth: number,
	) => {
		const gridList = [];
		let start = MAX_Y_AXIS_WIDTH;
		for (let i = 0; i < clusterLen; i++) {
			const totalCol = colList?.[i]?.length;
			const gridWidth = totalCol * colWidth;
			gridList.push({
				show: true,
				left: start,
				height: gridHeight,
				width: gridWidth,
				bottom: 0,
				top: MAX_CLUSTER_GROUP_HEIGHT + GAP_HEATMAP_VS_CLUSTER,
				borderWidth: 0,
				borderColor: "transparent",
				containLabel: false,
				totalCol,
			});
			start = start + gridWidth + CLUSTER_GAP;
		}
		return gridList;
	};

	return <div id="genesExpressionHeatmap0" className="mt-[100px] "></div>;
};

export default SplitByHeatmap;
