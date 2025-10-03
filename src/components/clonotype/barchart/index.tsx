import { Slider } from "antd";
import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import rawData from "./data.json";
import { checkValid } from "./filter";
import { cloneDeep } from "lodash";

const CELL_SIZE = 50;
// const CHART_WIDTH = 1500;
// const CHART_HEIGHT = 1000;
const filters = [
	{
		size: {
			$lt: 2,
		},
	},
	{
		size: {
			$and: [
				{
					$gte: 2,
				},
				{
					$lt: 5,
				},
			],
		},
	},
	{
		size: {
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
const ROWS_PER_VIEWS = 3;
const ClonotypeBarChart = () => {
	const chartRef = useRef<echarts.ECharts>(null);
	const optionRef = useRef<any>(null);
	const dataRef = useRef<any[]>([]);
	const xAxisRef = useRef<any[]>([]);
	const selectedDataIndexRef = useRef<number>(undefined);

	const test = () => {
		const data = rawData?.data?.["C100"];
		const items = data?.filter((item) => item.size >= 2 && item.size < 5);
		console.log("items", items);
		return items;
	};

	const divideColumnData = (items) => {
		const columnData = Array(filters.length).fill(0);
		for (const item of items) {
			for (let i = 0; i < filters.length; i++) {
				const filter = filters[i];
				const isValidFilter = checkValid(item, filter);
				if (isValidFilter) {
					columnData[i] += item.count;
					break;
				}
			}
		}
		return columnData;
	};

	const calculateBarChartData = () => {
		const data = rawData?.data;
		const dataPerColumn = [];
		const xAxis = [];
		for (const sampleId in data) {
			const items = data[sampleId];
			xAxis.push(sampleId);
			dataPerColumn.push(divideColumnData(items));
		}

		const barChartData = Array(filters.length).fill([]);

		for (const colData of dataPerColumn) {
			for (let i = 0; i < filters.length; i++) {
				barChartData[i] = [
					...barChartData[i],
					{
						value: colData[i],
						itemStyle: {
							color: palette[i],
							opacity: 1,
						},
					},
				];
			}
		}

		return { xAxis, barChartData };
	};

	const createOption = ({ xAxis, barChartData }) => {
		return {
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "shadow",
				},
			},
			legend: {},
			grid: {
				left: "3%",
				right: 30,
				bottom: 100,
				containLabel: true,
			},
			yAxis: {
				type: "category",
				data: [...xAxis].reverse(),
				triggerEvent: true,
				name: "Sample ID",
				nameLocation: "middle",
				nameGap: 50,
				nameTextStyle: {
					fontSize: 14,
				},
			},
			xAxis: {
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
			},
			dataZoom: [
				{
					type: "slider",
					startValue: xAxis.length,
					endValue: xAxis?.length - ROWS_PER_VIEWS,
					yAxisIndex: [0],
					zoomLock: true,
					brushSelect: false,
					backgroundColor: "white",
					borderColor: "#d9d9d9",
					fillerColor: "#d9d9d9",
					dataBackground: {
						lineStyle: {
							color: "transparent",
						},
						areaStyle: {
							color: "transparent",
						},
					},
					top: 20,
					bottom: 120,
					right: 10,
					width: 5,
					showDetail: false,
				},
				{
					type: "inside",
					yAxisIndex: [0],
					startValue: xAxis.length,
					endValue: xAxis?.length - ROWS_PER_VIEWS,
					zoomOnMouseWheel: false,
					// zoomLock: true,
				},
			],
			// series: [
			// 	{
			// 		name: "Direct",
			// 		type: "bar",
			// 		emphasis: {
			// 			focus: "series",
			// 		},
			// 		data: [320, 332, 301, 334, 390, 330, 320],
			// 	},
			// ],
			series: barChartData?.map((data, i) => {
				return {
					name: `Filter ${i + 1}`,
					type: "bar",
					stack: "total",
					emphasis: {
						focus: "series",
					},
					barWidth: 34,
					data,
				};
			}),
		};
	};

	useEffect(() => {
		renderChart();
	}, []);

	const renderChart = () => {
		console.log("renderChart===");
		if (chartRef.current) return;
		const chartDom = document.getElementById("main");
		if (!chartRef.current) {
			chartRef.current = echarts.init(chartDom, null, {
				renderer: "canvas",
				useDirtyRect: false,
				width: 900,
				height: 500,
			});
		}

		const { xAxis, barChartData } = calculateBarChartData();

		const option = createOption({ xAxis, barChartData });
		optionRef.current = option;
		dataRef.current = barChartData;
		xAxisRef.current = xAxis;
		console.log("option", option);
		chartRef.current.setOption(option);
		chartRef.current.on("click", (params) => {
			console.log("🚀 ===== renderChart ===== params:", params, selectedDataIndexRef.current);
			if (selectedDataIndexRef.current === params.dataIndex) {
				console.log("dataRef.current", dataRef.current);
				selectedDataIndexRef.current = undefined;
				chartRef.current?.dispatchAction({
					type: "downplay",
					dataIndex: [],
				});
				chartRef.current?.setOption(
					{
						series: dataRef.current?.map((data, i) => {
							return {
								name: `Filter ${i + 1}`,
								type: "bar",
								stack: "total",
								emphasis: {
									focus: "series",
								},
								data,
							};
						}),
						xAxis: {
							...optionRef.current.xAxis,
							data: xAxisRef.current,
						},
					},
					{
						replaceMerge: ["xAxis"],
					},
				);
				return;
			}
			selectedDataIndexRef.current = params.dataIndex;
			const newData = cloneDeep(dataRef.current);

			for (let i = 0; i < newData.length; i++) {
				for (let j = 0; j < newData[i]?.length; j++) {
					if (params.dataIndex === j) {
						newData[i][j].itemStyle.opacity = 1;
					} else {
						newData[i][j].itemStyle.opacity = 0.4;
					}
				}
			}
			console.log("🚀 ===== renderChart ===== newData:", newData);
			chartRef.current?.dispatchAction({
				type: "highlight",
				dataIndex: [params.dataIndex],
			});
			chartRef.current?.setOption(
				{
					series: newData?.map((data, i) => {
						return {
							name: `Filter ${i + 1}`,
							type: "bar",
							stack: "total",
							emphasis: {
								focus: "series",
							},
							data,
						};
					}),
					xAxis: {
						...optionRef.current.xAxis,
						data: xAxisRef.current?.map((item, index) => {
							if (index !== params.dataIndex) {
								return {
									value: item,
									textStyle: {
										color: "black",
									},
								};
							}

							return {
								value: item,
								textStyle: {
									color: "#175CD3",
									fontWeight: "bold",
								},
							};
						}),
					},
				},
				{
					replaceMerge: ["xAxis"],
				},
			);
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
	return (
		<div>
			<div className=" mx-auto w-[500px]">
				{["Filter 1", "Filter 2", "Filter 3"]?.map((item, index) => {
					return <div onMouseEnter={() => onHoverLegend(index)}>{item}</div>;
				})}
			</div>
			<div className="flex justify-center">
				<div id="main" className=""></div>
			</div>
		</div>
	);
};
export default ClonotypeBarChart;
