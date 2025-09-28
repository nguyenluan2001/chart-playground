import * as d3 from "d3";
import * as echarts from "echarts";
import { max, min } from "lodash";
import { useEffect, useRef, useState } from "react";
import rawData from "./data.json";
import kdeData from "./kde (1).json";

const ClonotypeViolin = () => {
	const createViolinPoints = () => {
		const densityRange = [min(kdeData.y), max(kdeData.y)] as number[];
		const scaleDensity = d3.scaleLinear(densityRange, [0, 0.8]);
		const leftPoints = [];
		const rightPoints = [];
		for (let i = 0; i < 100; i++) {
			const x = kdeData.y[i];
			const y = kdeData.x[i];
			leftPoints.push([1 - scaleDensity(x), y]);
			rightPoints.unshift([1 + scaleDensity(x), y]);
		}
		return { leftPoints, rightPoints };
	};

	const calculateClonotypeByCellSize = () => {
		const countClonotypeMap = new Map();
		for (const sampleId in rawData.data) {
			if (sampleId !== "C100") continue;
			const items = rawData.data[sampleId];

			for (const item of items) {
				const countedSize = countClonotypeMap.get(item.size);
				if (countedSize) {
					countClonotypeMap.set(item.size, countedSize + item.count);
				} else {
					countClonotypeMap.set(item.size, item.count);
				}
			}
		}
		return [...countClonotypeMap.entries()].map(([size, count]) => ({ size, count }));
	};

	const createScatterPoints = () => {
		const groups = calculateClonotypeByCellSize();
		const points = [];

		for (const group of groups) {
			const xDensity = group.count * 0.03;
			const xRange = [1 - xDensity / 2, 1 + xDensity / 2];
			const scaleX = d3.scaleLinear([1, group.count], xRange);

			for (let i = 1; i <= group.count; i++) {
				points.push([scaleX(i), group.size]);
			}
		}
		return points;
	};

	const createOption = () => {
		const { leftPoints, rightPoints } = createViolinPoints();
		const scatterPoints = createScatterPoints();
		return {
			grid: {
				width: 300,
				height: 600,
			},
			xAxis: {
				type: "value",
				min: 0,
				max: 2,
				step: 1,
			},
			yAxis: {
				type: "value",
			},
			series: [
				{
					data: [...leftPoints, ...rightPoints, leftPoints[0]],
					type: "line",
					smooth: true,
					areaStyle: {
						color: "rgba(104, 138, 232, 1)",
					},
					symbol: "none",
				},
				{
					type: "scatter",
					data: scatterPoints,
					symbol: "circle",
					symbolSize: 5,
					progressiveThreshold: scatterPoints?.length / 2,
					progressive: scatterPoints?.length / 2,
					itemStyle: {
						color: "rgba(227, 32, 32, 1)",
					},
				},
			],
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
			height: 1000,
		});

		const option = createOption();
		console.log("option", option);
		myChart.setOption(option);
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
export default ClonotypeViolin;
