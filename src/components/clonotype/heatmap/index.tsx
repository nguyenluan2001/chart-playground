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
			if (cell.x !== cell.y) {
				series.push([cell.y, cell.x, cellValue]);
			}
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
				left: "20%",
				// top: "10%",
			},
			xAxis: {
				name: "Sample ID",
				nameLocation: "middle",
				nameGap: 30,
				type: "category",
				data: xAxis,
				position: "top",
				splitArea: {
					show: true,
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
					show: true,
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
				orient: "horizontal",
				left: "center",
				bottom: "15%",
				outOfRange: {
					color: ["rgba(185, 185, 185, 1)"],
				},
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
				["C100", "C100", 1],
				["C149", "C148", 1],
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
			width: heatmapData?.xAxis?.length * CELL_SIZE + 300,
			height: heatmapData?.yAxis?.length * CELL_SIZE + 300,
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
