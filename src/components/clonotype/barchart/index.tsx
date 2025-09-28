import { Slider } from "antd";
import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import rawData from "./data.json";
import { checkValid } from "./filter";

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
const ClonotypeBarChart = () => {
	const [valueRange, setValueRange] = useState([]);
	const chartRef = useRef<echarts.ECharts>(null);
	const initialValueRangeRef = useRef<number[]>([]);

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
				barChartData[i] = [...barChartData[i], colData[i]];
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
				right: "4%",
				bottom: "3%",
				containLabel: true,
			},
			xAxis: [
				{
					type: "category",
					data: xAxis,
				},
			],
			yAxis: [
				{
					type: "value",
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
					data,
				};
			}),
		};
	};

	useEffect(() => {
		renderChart();
	}, []);

	const renderChart = () => {
		var chartDom = document.getElementById("main");
		var myChart = echarts.init(chartDom, null, {
			renderer: "canvas",
			useDirtyRect: false,
			width: 1500,
			height: 500,
		});

		const { xAxis, barChartData } = calculateBarChartData();
		console.log("barChartData", barChartData);
		console.log("test", test());

		const option = createOption({ xAxis, barChartData });
		console.log("option", option);
		myChart.setOption(option);
	};

	const onAdjustClonotype = (value) => {
		if (!chartRef.current) return;
		const heatmapData = convertHeatmapData(value);
		console.log("onAdjustClonotype", heatmapData);
		console.log("initial", initialValueRangeRef.current);
		// setValueRange(heatmapData.valueRange);
		const option = createOption({
			...heatmapData,
			valueRange: initialValueRangeRef.current,
			filterRange: heatmapData?.valueRange,
		});
		console.log("heatmapData", heatmapData);
		chartRef.current.setOption(option, {
			// notMerge: true,
		});
		// setFilterClonotype(value);
	};
	return (
		<div>
			<div className=" mx-auto w-[500px]"></div>
			<div className="flex justify-center">
				<div id="main" className=""></div>
			</div>
		</div>
	);
};
export default ClonotypeBarChart;
