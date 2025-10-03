import { Slider } from "antd";
import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import rawData from "./data.json";

const CELL_SIZE = 50;
// const CHART_WIDTH = 1500;
// const CHART_HEIGHT = 1000;

const ClonotypeHeatmap = () => {
	const [valueRange, setValueRange] = useState([]);
	const chartRef = useRef<echarts.ECharts>(null);
	const initialValueRangeRef = useRef<number[]>([]);
	// const [filterClonotype, setFilterClonotype] = useState(0);
	const convertHeatmapData = (nCells = Number.NEGATIVE_INFINITY) => {
		let xAxis = [];
		let yAxis = [];
		const series = [];
		const valueRange = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
		for (let i = 0; i < rawData?.data?.length; i++) {
			const cell = rawData?.data?.[i];
			const cellValue = cell.values?.filter((item) => item.size > nCells)?.length;
			xAxis = [...new Set([...xAxis, cell.x])];
			yAxis = [...new Set([...yAxis, cell.y])];
			series.push([cell.x, cell.y, cellValue]);
			// if (cell.x !== cell.y) {
			// 	series.push([cell.y, cell.x, cellValue]);
			// }
			valueRange[0] = Math.min(valueRange[0], cellValue);
			valueRange[1] = Math.max(valueRange[1], cellValue);
		}
		return {
			xAxis,
			yAxis,
			series,
			valueRange,
		};
	};

	const createOption = ({ xAxis, yAxis, series, valueRange, filterRange }) => {
		const colors = [
			"#FFFEC7",
			"#FFE999",
			"#FED370",
			"#FDA849",
			"#FB823B",
			"#F9472B",
			"#DC1E20",
			"#B20F25",
			"#730A23",
		];
		return {
			animation: false,
			tooltip: {
				position: "bottom",
				formatter: (params) => {
					const data = params?.data;
					const samplePair = `${data[0]} - ${data[1]}`;
					const nSameClonotype = data[2];
					return `
            <div style="padding: 8px; width: 300px">
              <div style="width: 100%; display:flex; justify-content:space-between; align-items:center">
                  <p>Sample pair</p>
                  <p>${samplePair}</p>
              </div> 
              <div style="width: 100%; display:flex; justify-content:space-between; align-items:center">
                  <p>Number of same clonotypes</p>
                  <p>${nSameClonotype}</p>
              </div> 
            </div>
          
          
          `;
				},
			},
			grid: {
				width: xAxis?.length * CELL_SIZE,
				height: yAxis?.length * CELL_SIZE,
				// height: "50%",
				left: 100,
				top: 0,
			},
			xAxis: {
				name: "Sample ID",
				nameLocation: "middle",
				nameGap: 30,
				type: "category",
				data: xAxis,
				position: "bottom",
				splitArea: {
					show: false,
				},
				axisTick: {
					show: false,
				},
			},
			yAxis: {
				type: "category",
				name: "Sample ID",
				nameLocation: "middle",
				nameGap: 60,
				nameRotate: 90,
				data: yAxis,
				inverse: true,
				splitArea: {
					show: false,
				},
				axisTick: {
					show: false,
				},
			},
			visualMap: {
				show: false,
				min: valueRange[0],
				max: valueRange[1],
				range: [1, valueRange[1]],
				seriesIndex: 0,
				// calculable: true,
				// text: ["Number of shared clonotypes", ""],
				// align: "right",
				// orient: "vertical",
				// hoverLink: false,
				// realtime: false,
				// handleIcon: "none",
				// right: 0,
				// top: 0,
				outOfRange: {
					color: ["rgba(185, 185, 185, 1)"],
				},
				inRange: {
					color: colors,
				},

				// color: ["#730A23", "#DC1E20", "#FB823B", "#FDA849", "#FFE999", "#FFFFFF"],
			},
			series: [
				{
					name: "Punch Card",
					type: "heatmap",
					data: series,
					label: {
						show: true,
					},
					itemStyle: {
						borderWidth: 1,
						borderColor: "#ffffff",
					},
					emphasis: {
						disabled: true,
					},
				},
				createScatterSeries([CELL_SIZE, CELL_SIZE]),
			],
			graphic: [
				{
					type: "group",
					// rotation: Math.PI / 4,
					// bounding: "raw",
					// right: 110,
					// bottom: 110,
					width: 169,
					height: 114,
					top: 0,
					right: 0,
					z: 100,
					children: [
						{
							type: "rect",
							right: 0,
							top: 20,
							z: 100,
							shape: {
								width: 8,
								height: 92,
							},
							style: {
								fill: new echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1, // x0, y0, x1, y1 (defines the gradient direction)
									[...colors]
										.reverse()
										.map((color, index) => ({
											offset: (1 / (colors.length - 1)) * index,
											color,
										})),
									// [
									// 	{ offset: 0, color: "#730A23" },
									// 	{ offset: 0.2, color: "#DC1E20" },
									// 	{ offset: 0.4, color: "#FB823B" },
									// 	{ offset: 0.6, color: "#FDA849" },
									// 	{ offset: 0.8, color: "#FFE999" },
									// 	{ offset: 1, color: "#FFFFFF" },
									// ],
								),
							},
						},
						{
							type: "text",
							right: 0,
							top: 0,
							z: 100,
							style: {
								text: "Number of shared clonotypes",
								font: "normal 14px sans-serif",
							},
						},
						{
							type: "text",
							top: 20,
							right: 12,
							z: 100,
							style: {
								text: "75",
								font: "normal 14px sans-serif",
							},
						},
						{
							type: "text",
							top: 10 + 92,
							right: 12,
							z: 100,
							style: {
								text: "0",
								font: "normal 14px sans-serif",
							},
						},
					],
				},
			],
		};
	};

	const createScatterSeries = (cellSize: number) => {
		return {
			type: "scatter",
			symbol: "rect",
			symbolSize: cellSize,
			animation: false,
			itemStyle: {
				color: "transparent",
				borderColor: "rgba(23, 92, 211, 1)",
			},
			emphasis: {
				disabled: true,
			},
			data: [
				// ["C100", "C100", 1],
				// ["C149", "C148", 1],
			],
		};
	};

	useEffect(() => {
		renderChart();
	}, []);

	const renderChart = () => {
		const heatmapData = convertHeatmapData();
		var chartDom = document.getElementById("main");
		var myChart = echarts.init(chartDom, null, {
			renderer: "canvas",
			useDirtyRect: false,
			width: heatmapData?.xAxis?.length * CELL_SIZE + 100,
			height: heatmapData?.yAxis?.length * CELL_SIZE + 100,
		});
		chartRef.current = myChart;
		initialValueRangeRef.current = heatmapData?.valueRange;
		setValueRange(heatmapData.valueRange);
		const option = createOption({ ...heatmapData, filterRange: [0, 0] });
		myChart.setOption(option);
		myChart.on("click", (params) => {
			const data = params?.data;
			const chartOption = myChart.getOption();
			// Border selected cell
			chartOption.series?.[1]?.data?.push(data);

			// Highlight axis label
			for (let i = 0; i < heatmapData?.xAxis?.length; i++) {
				const xaxis = heatmapData?.xAxis[i];
				if (xaxis === data?.[0]) {
					chartOption.xAxis[0].data[i] = {
						value: xaxis,
						textStyle: {
							color: "#0E47B9",
							fontWeight: 600,
						},
					};
				}
			}

			for (let i = 0; i < heatmapData?.yAxis?.length; i++) {
				const yaxis = heatmapData?.yAxis[i];
				if (yaxis === data?.[1]) {
					chartOption.yAxis[0].data[i] = {
						value: yaxis,
						textStyle: {
							color: "#0E47B9",
							fontWeight: 600,
						},
					};
				}
			}
			myChart.setOption(chartOption, {
				replaceMerge: ["series", "xAxis", "yAxis"],
			});
		});
		myChart.on("datarangeselected", (params) => {
			console.log("🚀 ===== renderChart ===== params:", params);
			return;
		});
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
			<div className=" mx-auto w-[500px]">
				<Slider
					className="w-full"
					min={valueRange[0]}
					max={valueRange[1]}
					// value={filterClonotype}
					onChangeComplete={onAdjustClonotype}
				/>
			</div>
			<div className="flex justify-center">
				<div id="main" className=""></div>
			</div>
		</div>
	);
};
export default ClonotypeHeatmap;
