import { Button, Slider } from "antd";
import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import chartData from "./data.json";
import { checkValid } from "./filter";
import { cloneDeep, sum } from "lodash";
import * as d3 from "d3";

const CELL_SIZE = 50;
// const CHART_WIDTH = 1500;
// const CHART_HEIGHT = 1000;
const filters = [
	{
		clone_id_size: {
			$eq: 1,
		},
	},
	{
		clone_id_size: {
			$and: [
				{
					$gt: 1,
				},
				{
					$lte: 3,
				},
			],
		},
	},
	{
		clone_id_size: {
			$and: [
				{
					$gt: 3,
				},
				{
					$lte: 5,
				},
			],
		},
	},
	{
		clone_id_size: {
			$gte: 5,
		},
	},
];
const palette = [
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
];
const ROWS_PER_VIEWS = 4;
const SwarmChart = () => {
	const chartRef = useRef<echarts.ECharts>(null);
	const optionRef = useRef<any>(null);
	const dataRef = useRef<any[]>([]);
	const xAxisRef = useRef<any[]>([]);
	const selectedDataIndexRef = useRef<number>(undefined);

	const divideColumnData = (items: IStackedBarChartItem[]) => {
		const columnData = Array(filters.length).fill(0);
		const cloneSizeCount = Array(filters.length).fill([]);
		for (const item of items) {
			let isValidFilter = false;
			let validFilterIdx = -1;
			for (let i = 0; i < filters.length; i++) {
				const filter = filters[i];
				isValidFilter = checkValid(item, filter);
				if (isValidFilter) {
					columnData[i] += item.count;
					validFilterIdx = i;
					break;
				}
			}
			if (isValidFilter && validFilterIdx >= 0) {
				// cloneSizeCount[validFilterIdx].push([item.clone_id_size, item.count || 0]);
				cloneSizeCount[validFilterIdx] = cloneSizeCount[validFilterIdx].concat([
					[item.clone_id_size, item.count || 0],
				]);
			}
		}
		return { columnData, cloneSizeCount };
	};

	const calculateBarChartData = () => {
		if (!chartData) return { yAxis: [], barChartData: [], maxXValue: 0 };
		const dataPerColumn = [];
		const cloneSizeCountArr = [];
		const yAxis = [];
		const colors = palette;
		let maxXValue = Number.NEGATIVE_INFINITY;
		for (let i = 0; i < chartData?.clusters.length; i++) {
			yAxis.push(chartData?.clusters[i]);
			const { columnData, cloneSizeCount } = divideColumnData(chartData.counts[i]);
			// console.log("🚀 ===== calculateBarChartData ===== cloneSizeCount:", cloneSizeCount);
			maxXValue = Math.max(maxXValue, sum(columnData));
			dataPerColumn.push(columnData);
			cloneSizeCountArr.push(cloneSizeCount);
		}
		console.log("🚀 ===== calculateBarChartData ===== dataPerColumn:", dataPerColumn);
		console.log("🚀 ===== calculateBarChartData ===== cloneSizeCountArr:", cloneSizeCountArr);

		const barChartData = Array(filters.length).fill([]);

		for (const colData of [...dataPerColumn].reverse()) {
			for (let i = 0; i < filters.length; i++) {
				barChartData[i] = [
					...barChartData[i],
					{
						value: colData[i],
						itemStyle: {
							color: colors[i],
							opacity: 1,
						},
					},
				];
			}
		}

		const scatterSeries = Array(filters.length).fill([]);
		for (let cloneIdx = 0; cloneIdx < cloneSizeCountArr.length; cloneIdx++) {
			for (let i = 0; i < cloneSizeCountArr[cloneIdx].length; i++) {
				scatterSeries[i] = scatterSeries[i].concat(
					generateFilterPoints(cloneIdx, cloneSizeCountArr[cloneIdx][i]),
				);
			}
		}

		console.log("🚀 ===== calculateBarChartData ===== scatterSeries:", scatterSeries);
		// Rounded max value: 5678 => 6000
		const valueStr = `${maxXValue}`;
		const roundedValue = (parseInt(`${valueStr[0]}`) + 1) * Math.pow(10, valueStr.length - 1 || 0);

		return {
			yAxis: yAxis.reverse(),
			barChartData,
			scatterSeries,
			maxXValue: roundedValue,
		};
	};

	const generateFilterPoints = (clusterIdx: number, filteredClone: number[][]) => {
		let points = [];
		for (const clone of filteredClone) {
			if (clone[1] === 0) continue;
			// points.push([clone[0], clusterIdx, clone[1]]);
			points = points.concat(generateSingleSizePoints(clone[0], clusterIdx, clone[1]));
		}
		return points;
	};

	const generateSingleSizePoints = (xIdx: number, yIdx: number, amount: number) => {
		if (amount === 1) return [[xIdx, yIdx]];
		const numPoints = Math.min(amount, 50);
		const scaleDensity = d3.scaleLinear([0, numPoints], [0, 0.4]);
		const leftPoints = [];
		const rightPoints = [];
		for (let i = 0; i < numPoints; i++) {
			leftPoints.push([xIdx, yIdx - scaleDensity(i)]);
			rightPoints.unshift([xIdx, yIdx + scaleDensity(i)]);
		}
		// return { leftPoints, rightPoints };
		return [...leftPoints, ...rightPoints];
	};

	const createOption = ({
		yAxis,
		barChartData,
		scatterSeries,
		maxXValue,
	}: {
		yAxis: string[];
		barChartData: echarts.BarSeriesOption["data"];
		scatterSeries: number[][];
		maxXValue: number;
	}): {
		exportedOption: any;
		viewOption: any;
	} => {
		const maxYAxisSize = 100;
		const exportedOption = {
			animation: false,
			tooltip: {
				show: true,
				trigger: "axis",
				axisPointer: {
					type: "shadow",
				},
			},
			legend: {
				show: true,
			},
			grid: {
				show: true,
				left: 100,
				top: 100,
				right: 30,
				bottom: 100,
				containLabel: true,
				backgroundColor: "rgba(255, 255, 255, 1)",
			},
			yAxis: [
				{
					type: "category",
					data: yAxis.map((item: string, index: number) => {
						if (index === selectedDataIndexRef.current) {
							return {
								value: item,
								textStyle: {
									color: "#0E47B9",
									fontWeight: 600,
								},
							};
						}
						return {
							value: item,
						};
					}),
					triggerEvent: true,
					name: "Sample ID",
					nameLocation: "middle",
					nameGap: maxYAxisSize + 10,
					nameTextStyle: {
						fontSize: 14,
					},
				},
				{
					type: "value",
					// data: yAxis.map((item: string, index: number) => {
					// 	return {
					// 		value: index,
					// 	};
					// }),
					min: 0.5,
					max: yAxis.length - 0.5,
					interval: 0.5,
					triggerEvent: true,
					name: "Sample ID",
					nameLocation: "middle",
					nameGap: maxYAxisSize + 10,
					nameTextStyle: {
						fontSize: 14,
					},
				},
			],
			xAxis: [
				{
					type: "value",
					name: "Number of clonotypes",
					nameLocation: "middle",
					nameGap: 30,
					nameTextStyle: {
						fontSize: 14,
					},
					axisLine: {
						show: true,
					},
					// max: maxXValue,
				},
				{
					type: "value",
					name: "Number of clonotypes",
					nameLocation: "middle",
					nameGap: 30,
					nameTextStyle: {
						fontSize: 14,
					},
					axisLine: {
						show: true,
					},
					// max: maxXValue,
				},
			],
			// series: barChartData?.map((data, i) => {
			// 	return {
			// 		type: "bar",
			// 		stack: "total",
			// 		emphasis: {
			// 			focus: "series",
			// 		},
			// 		barWidth: 30,
			// 		data,
			// 	};
			// }) as echarts.SeriesOption[],

			series: scatterSeries?.map((data, i) => {
				return {
					type: "scatter",
					data,
					xAxisIndex: 1,
					yAxisIndex: 1,
					symbolSize: [5, 5],
				};
			}) as echarts.SeriesOption[],
			// series: {
			// 	type: "scatter",
			// 	data: [
			// 		[100, 19],
			// 		[40, 19.5],
			// 	],
			// 	xAxisIndex: 1,
			// 	yAxisIndex: 1,
			// },
		};
		const dataZoom = [];
		const viewOption = {
			...exportedOption,
			dataZoom,
		};
		return { exportedOption, viewOption };
	};

	useEffect(() => {
		renderChart();
	}, []);

	const renderChart = () => {
		if (chartRef.current) return;

		//Get element
		const chartDom = document.getElementById("main");
		if (!chartRef.current) {
			chartRef.current = echarts.init(chartDom, null, {
				renderer: "canvas",
				useDirtyRect: false,
				width: 1500,
				height: 2000,
			});
		}
		//Calculate data
		const { yAxis, barChartData, maxXValue, scatterSeries } = calculateBarChartData();
		console.log("🚀 ===== renderChart ===== barChartData:", barChartData);

		//Init chart

		//Render chart
		const { exportedOption, viewOption } = createOption({
			yAxis,
			barChartData,
			scatterSeries,
			maxXValue,
		});

		chartRef.current.setOption(viewOption);

		optionRef.current = viewOption;
		dataRef.current = barChartData;

		chartRef.current.on("click", (params) => {
			if (!["yAxis", "series"]?.includes(params.componentType)) return;
			if (params.componentType === "yAxis" && params.targetType !== "axisLabel") return;

			selectedDataIndexRef.current = params.dataIndex;
			const clusterIndex = yAxis.length - 1 - params.dataIndex;
			const cloneIds = chartData?.counts[clusterIndex].reduce<number[]>((pre, current) => {
				pre = pre.concat(current.clone_ids || []);
				return pre;
			}, []);
		});
	};

	const onHoverLegend = (index) => {
		if (!chartRef.current) return;
		chartRef.current.dispatchAction({
			type: "highlight",

			// Find  by index or id or name.
			// Can be an array to find multiple components.
			seriesIndex: index,
		});
	};
	const onScrollTo = () => {
		const scrollIndex = 0;
		chartRef.current?.dispatchAction({
			type: "dataZoom",
			// optional; index of dataZoomcomponent; useful for are multiple dataZoom components; 0 by default
			dataZoomIndex: 0,
			// data value at starting location
			startValue: xAxisRef.current?.length - scrollIndex,
			// data value at ending location
			endValue: xAxisRef.current?.length - scrollIndex - ROWS_PER_VIEWS,
		});
	};
	return (
		<div>
			<div className=" mx-auto">
				{["Filter 1", "Filter 2", "Filter 3"]?.map((item, index) => {
					return <div onMouseEnter={() => onHoverLegend(index)}>{item}</div>;
				})}
			</div>
			<div className="flex justify-center">
				<div id="main" className=""></div>
			</div>
			<Button onClick={onScrollTo}>Scroll to</Button>
		</div>
	);
};
export default SwarmChart;
