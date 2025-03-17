import * as echarts from "echarts";
import { isEmpty, sum } from "lodash";
import { useEffect } from "react";
import data from "./data.json";

const GRID_LEFT = 100;
const GROUP_LEGEND_WIDTH = 15;

const Heatmap = () => {
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
		const { seriesData, minExp, maxExp } = createSeriesData();
		const option = {
			animation: false,
			grid: {
				width: 1000,
				height: 500,
				left: GRID_LEFT,
			},
			xAxis: [
				{
					type: "category",
					min: 0,
					max: sum(data.col),
					step: 1,
					axisLabel: {
						show: false,
					},
					axisTick: {
						show: false,
					},
				},
			],
			yAxis: {
				type: "category",
				min: 0,
				max: sum(data.row),
				step: 1,
				inverse: true,
				axisLabel: {
					show: false,
				},
				axisTick: {
					show: false,
				},
			},
			series: [
				{
					type: "heatmap",
					itemStyle: {
						// color: "red",
						opacity: 1,
					},
					data: seriesData,
					emphasis: {
						disabled: true,
					},
					progressive: 0,
				},
				// ...lineSeries,
			],
			visualMap: [
				{
					seriesIndex: 0,
					min: minExp,
					max: maxExp,
					calculable: true,
					realtime: false,
					inRange: {
						color: ["rgba(0,0,255)", "rgba(255,255,255)", "rgba(255,0,0)"],
					},
				},
				// {
				// 	seriesIndex: 0,
				// 	min: 0,
				// 	max: maxExp,
				// 	calculable: true,
				// 	realtime: false,
				// 	inRange: {
				// 		color: ["#ffffff", "rgba(255,0,0)"],
				// 	},
				// },
			],
			graphic: [
				{
					type: "group",
					left: "10%",
					top: 0,
					children: [
						{
							type: "polyline",
							z: 100,
							left: "center",
							top: 40,
							shape: {
								points: [
									[30, 30],
									[30, 20],
									[200, 20],
									[200, 30],
								],
							},
							style: {
								fill: "transparent",
								stroke: "#000000",
							},
						},
						{
							type: "text",
							z: 100,
							left: "center",
							top: 0,
							rotation: Math.PI / 2,
							style: {
								fill: "#333",
								width: 220,
								overflow: "break",
								text: "chr 1",
								font: "14px Microsoft YaHei",
							},
						},
					],
				},
			],
			brush: {
				toolbox: ["rect", "polygon", "lineX", "lineY", "keep", "clear"],
				brushType: "rect",
				xAxisIndex: 0,
			},
			toolbox: {
				feature: {
					magicType: {
						type: ["stack"],
					},
					dataView: {},
				},
			},
		};
		console.log("option", option);
		myChart.setOption(option);
		myChart.on("brushSelected", (params) => {
			console.log("params", params);
		});
		onDrawChromosome(myChart, data?.col, data?.row);
	};
	const approxeq = (v1, v2, epsilon) => {
		if (epsilon == null) {
			epsilon = 0.001;
		}
		return Math.abs(v1 - v2) < epsilon;
	};

	const createSeriesData = () => {
		const series = [];
		let minExp = Number.POSITIVE_INFINITY;
		let maxExp = Number.NEGATIVE_INFINITY;
		for (let rowIdx = 0; rowIdx < data.data?.length; rowIdx++) {
			const columns = data?.data?.[rowIdx];
			for (let colIdx = 0; colIdx < columns.length; colIdx++) {
				const exp = columns[colIdx];
				series.push({
					value: [colIdx, rowIdx, exp],
					...(approxeq(1, exp, 0.001)
						? {
								itemStyle: {
									color: "#ffffff",
								},
							}
						: {}),
				});
				minExp = Math.min(minExp, exp);
				maxExp = Math.max(maxExp, exp);
			}
		}
		return { seriesData: series, minExp, maxExp };
	};

	const onDrawChromosome = (instance: any, cols: number[], rows: number[]) => {
		console.log("instance", instance);
		if (!instance) return;
		const rect = instance?._coordSysMgr?._coordinateSystems?.[0]?._rect;
		const totalCol = sum(cols);
		const totalRow = sum(rows);
		const graphic = [];
		let offset = 0;
		let heightOffset = rect.y;
		cols?.forEach((col, index) => {
			const chromosomeWidth = (rect?.width / totalCol) * col;
			const chromGraphic = {
				type: "group",
				left: GRID_LEFT + offset,
				top: 0,
				width: chromosomeWidth,
				children: [
					{
						type: "polyline",
						z: 100,
						left: "center",
						top: 40,
						shape: {
							points: [
								[0, 30],
								[0, 20],
								[chromosomeWidth, 20],
								[chromosomeWidth, 30],
							],
						},
						style: {
							fill: "transparent",
							stroke: "#000000",
						},
					},
					{
						type: "text",
						z: 100,
						left: "center",
						top: 0,
						rotation: Math.PI / 2,
						style: {
							fill: "#333",
							width: 220,
							overflow: "break",
							text: `chr ${index + 1}`,
							font: "14px Microsoft YaHei",
						},
					},
					{
						type: "polyline",
						y: rect.y,
						z: 300,
						shape: {
							points: [
								[chromosomeWidth, 0],
								[chromosomeWidth, rect?.height],
							],
						},
					},
				],
			};
			graphic.push(chromGraphic);
			offset += chromosomeWidth;
		});
		rows?.forEach((row, index) => {
			const chromosomeHeight = (rect?.height / totalRow) * row;
			let groupDivider = {};
			if (index === 0) {
				groupDivider = {
					type: "polyline",
					z: 300,
					x: GROUP_LEGEND_WIDTH,
					y: chromosomeHeight,
					shape: {
						points: [
							[0, 0],
							[rect.width, 0],
						],
					},
				};
			}
			const chromGraphic = {
				type: "group",
				x: rect.x - GROUP_LEGEND_WIDTH,
				y: heightOffset,
				width: GROUP_LEGEND_WIDTH,
				height: chromosomeHeight,
				children: [
					{
						textContent: "Cancer",
						type: "rect",
						x: 0,
						shape: {
							x: 0,
							y: 0,
							width: GROUP_LEGEND_WIDTH,
							height: chromosomeHeight,
						},
						style: {
							fill: index === 0 ? "#1f77b4" : "#ff7f0e",
						},
					},
					{
						type: "text",
						z: 100,
						top: "middle",
						x: -GROUP_LEGEND_WIDTH - 40,
						style: {
							fill: "#333",
							overflow: "break",
							text: index === 0 ? "Cancer" : "Normal",
							font: "14px Microsoft YaHei",
						},
					},
					...(isEmpty(groupDivider) ? [] : [groupDivider]),
				],
			};
			heightOffset += chromosomeHeight;
			graphic.push(chromGraphic);
		});
		instance.setOption({
			graphic,
		});
	};
	return <div id="echarts"></div>;
};

export default Heatmap;
