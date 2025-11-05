import * as echarts from "echarts";
import { isEmpty, sum } from "lodash";
import { useEffect } from "react";
import data from "./data.json";

const GRID_LEFT = 100;
const GROUP_LEGEND_WIDTH = 15;

const SplitByHeatmap = () => {
	console.log(data);
	useEffect(() => {
		onRender();
	}, []);

	const onRender = () => {
		const dom = document.getElementById("echarts");
		const myChart = echarts.init(dom, null, {
			renderer: "canvas",
			useDirtyRect: false,
			width: 1200,
			height: 1000,
		});
		// const { seriesData, minExp, maxExp } = createSeriesData();
		const option: echarts.EChartsOption = {
			animation: false,
			grid: {
				width: 1000,
				height: 30,
				left: GRID_LEFT,
			},
			xAxis: {
				type: "value",
				min: 0,
				max: 100,
			},
			yAxis: [
				{
					type: "category",
					axisLabel: {
						fontSize: 11,
					},
					// data: ["Metadata 1", "Metadata 2"],
				},
				// {
				// 	type: "category",
				// 	data: ["Metadata 1", "Metadata 2"],
				// },
			],
			dataset: [
				{
					source: [
						["metadata", "C1", "C2", "C3"],
						["M2", 20, 80, 0],
					],
				},
				{
					source: [
						["metadata", "C1", "C2", "C3"],
						["M3", 40, 50, 30],
					],
				},
			],
			series: [
				// {
				// 	type: "bar",
				// 	seriesLayoutBy: "row",
				// 	stack: "total",
				// 	// stack: "total",
				// 	// yAxisIndex: [0],
				// 	// datasetIndex: 0,
				// },
				{
					type: "bar",
					stack: "total",
					barWidth: 10,
				},
				{
					type: "bar",
					stack: "total",
					barWidth: 10,
				},
				{
					type: "bar",
					stack: "total",
					barWidth: 10,
				},
				{
					type: "bar",
					// seriesLayoutBy: "row",
					stack: "total",
					datasetIndex: 1,
					barWidth: 10,
				},
				{
					type: "bar",
					stack: "total",
					datasetIndex: 1,
					barWidth: 10,
				},
				{
					type: "bar",
					stack: "total",
					datasetIndex: 1,
					barWidth: 10,
				},
				// {
				// 	type: "bar",
				// 	stack: "total",
				// 	data: [20, 0, 0],
				// },
				// {
				// 	type: "bar",
				// 	stack: "total",
				// 	data: [50, 0, 0],
				// },
				// {
				// 	type: "bar",
				// 	stack: "total",
				// 	data: [30, 0, 0],
				// },
			],
		};
		console.log("option", option);
		myChart.setOption(option);
		myChart.on("brushSelected", (params) => {
			console.log("params", params);
		});
	};
	const createSeriesData = () => {};

	return <div id="echarts"></div>;
};

export default SplitByHeatmap;
