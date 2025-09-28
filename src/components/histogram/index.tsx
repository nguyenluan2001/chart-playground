import * as echarts from "echarts";
import { get, isEmpty, sum } from "lodash";
import { useEffect, useRef } from "react";
import data from "./data.json";

const GRID_LEFT = 100;
const GROUP_LEGEND_WIDTH = 15;

const Histogram = () => {
	const chartRef = useRef<any>(null);
	const graphicRef = useRef<any>(null);
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
		chartRef.current = myChart;
		const option = data;

		myChart?.dispatchAction({
			type: "takeGlobalCursor",
			key: "brush",
			brushOption: {
				brushType: "lineX",
				brushMode: "single",
			},
		});
		myChart.setOption(option);
		myChart.on("brushselected", (params) => {
			if (params?.batch?.[0]?.areas?.length === 0) return;
			const position = params?.batch?.[0]?.areas?.[0]?.range;
			const [leftPos, rightPos] = position;
			const gridRect = getGridRect(myChart);
			const shapeLine1 = {
				x1: leftPos,
				y1: get(gridRect, ["y"]),
				x2: leftPos,
				y2: get(gridRect, ["height"]) + 17,
			};
			const shapeLine2 = {
				x1: rightPos,
				y1: get(gridRect, ["y"]),
				x2: rightPos,
				y2: get(gridRect, ["height"]) + 17,
			};
			const shapeRect = {
				x: leftPos,
				y: get(gridRect, ["y"]),
				width: rightPos - leftPos,
				height: get(gridRect, ["height"]),
			};
			console.log("position: ", leftPos, rightPos);
			myChart.setOption({
				graphic: [
					{
						type: "line",
						name: "Drag to change the cutoff",
						shape: shapeLine1,
						draggable: "horizontal",
						cursor: "ew-resize",
						ondrag: (params: any) => {
							const pos = params.target.shape?.x1 + params.target.transform?.[4];
							if (pos < gridRect?.x || pos > gridRect?.x + gridRect?.width) {
								return;
							}
							const newGraphic = [
								{
									...(graphicRef?.current[0] || {}),
									draggable: "horizontal",
									cursor: "ew-resize",
									shape: {
										x1: pos,
										y1: get(gridRect, ["y"]),
										x2: pos,
										y2: get(gridRect, ["height"]) + 17,
									},
									onclick: () => {
										return;
									},
								},
								{
									type: "rect",
									shape: {
										x: pos,
										y: get(gridRect, ["y"]),
										width: get(gridRect, ["width"]) - pos + 10,
										height: get(gridRect, ["height"]),
									},
									style: {
										fill: "rgba(105, 177, 255, 0.32)",
										opacity: 0.5,
									},
								},
							];
							graphicRef.current = newGraphic;
							instance.setOption(
								{
									graphic: newGraphic,
								},
								{
									replaceMerge: ["graphic"],
								},
							);
						},
						// ondragend: (params: any) => {
						// 	if (isEmpty(dataHistogram)) return;
						// 	const pos = params.target.shape?.x1 + params.target.transform?.[4];
						// 	let thresholdVal = instance?.convertFromPixel({ xAxisIndex: 0 }, pos);
						// 	if (Number.isNaN(+thresholdVal)) return;
						// 	if (thresholdVal < dataHistogram?.min) {
						// 		thresholdVal = dataHistogram?.min;
						// 	}
						// 	if (thresholdVal > dataHistogram?.max) {
						// 		thresholdVal = dataHistogram?.max;
						// 	}
						// 	thresholdRef.current = thresholdVal;
						// 	setThreshold({
						// 		[currentSplitBy]: thresholdRef as any,
						// 	});
						// 	setInput(
						// 		(pre) =>
						// 			({
						// 				...pre,
						// 				// from: +(thresholdVal || 0)?.toFixed(5)
						// 				from: +thresholdVal || 0,
						// 			}) as InputBrush,
						// 	);
						// },
						style: {
							stroke: "#0A41AD",
							lineWidth: 2,
						},
						z: 9999,
					},
					{
						type: "rect",
						shape: shapeRect,
						style: {
							// fill: "rgba(105, 177, 255, 0.32)",
							fill: "red",
							opacity: 0.5,
						},
					},
					{
						type: "line",
						name: "Drag to change the cutoff",
						shape: shapeLine2,
						draggable: "horizontal",
						cursor: "ew-resize",
						ondrag: (params: any) => {
							const pos = params.target.shape?.x1 + params.target.transform?.[4];
							if (pos < gridRect?.x || pos > gridRect?.x + gridRect?.width) {
								return;
							}
							const newGraphic = [
								{
									...(graphicRef?.current[0] || {}),
									draggable: "horizontal",
									cursor: "ew-resize",
									shape: {
										x1: pos,
										y1: get(gridRect, ["y"]),
										x2: pos,
										y2: get(gridRect, ["height"]) + 17,
									},
									onclick: () => {
										return;
									},
								},
								{
									type: "rect",
									shape: {
										x: pos,
										y: get(gridRect, ["y"]),
										width: get(gridRect, ["width"]) - pos + 10,
										height: get(gridRect, ["height"]),
									},
									style: {
										fill: "rgba(105, 177, 255, 0.32)",
										opacity: 0.5,
									},
								},
							];
							graphicRef.current = newGraphic;
							instance.setOption(
								{
									graphic: newGraphic,
								},
								{
									replaceMerge: ["graphic"],
								},
							);
						},
						// ondragend: (params: any) => {
						// 	if (isEmpty(dataHistogram)) return;
						// 	const pos = params.target.shape?.x1 + params.target.transform?.[4];
						// 	let thresholdVal = instance?.convertFromPixel({ xAxisIndex: 0 }, pos);
						// 	if (Number.isNaN(+thresholdVal)) return;
						// 	if (thresholdVal < dataHistogram?.min) {
						// 		thresholdVal = dataHistogram?.min;
						// 	}
						// 	if (thresholdVal > dataHistogram?.max) {
						// 		thresholdVal = dataHistogram?.max;
						// 	}
						// 	thresholdRef.current = thresholdVal;
						// 	setThreshold({
						// 		[currentSplitBy]: thresholdRef as any,
						// 	});
						// 	setInput(
						// 		(pre) =>
						// 			({
						// 				...pre,
						// 				// from: +(thresholdVal || 0)?.toFixed(5)
						// 				from: +thresholdVal || 0,
						// 			}) as InputBrush,
						// 	);
						// },
						style: {
							stroke: "red",
							lineWidth: 2,
						},
						z: 9999,
					},
				],
			});
		});
	};

	const getGridRect = (instance: any) => {
		return get(instance, ["_coordSysMgr", "_coordinateSystems", "0", "_rect"]);
	};
	const generateGraphic = (inputThreshold: number) => {
		if (!chartRef.current) return;
		const instance = chartRef.current;
		const threshold = instance.convertToPixel({ xAxisIndex: 0 }, inputThreshold || 0);
		const gridRect = getGridRect(instance);
		const shape = {
			x1: threshold,
			y1: get(gridRect, ["y"]),
			x2: threshold,
			y2: get(gridRect, ["height"]) + 17,
		};
		const shapeRect = {
			x: threshold,
			y: get(gridRect, ["y"]),
			width: get(gridRect, ["width"]) - threshold + 10,
			height: get(gridRect, ["height"]),
		};
		const graphic = [
			{
				type: "line",
				name: "Drag to change the cutoff",
				shape: shape,
				draggable: "horizontal",
				cursor: "ew-resize",
				ondrag: (params: any) => {
					const pos = params.target.shape?.x1 + params.target.transform?.[4];
					if (pos < gridRect?.x || pos > gridRect?.x + gridRect?.width) {
						return;
					}
					const newGraphic = [
						{
							...(graphicRef?.current[0] || {}),
							draggable: "horizontal",
							cursor: "ew-resize",
							shape: {
								x1: pos,
								y1: get(gridRect, ["y"]),
								x2: pos,
								y2: get(gridRect, ["height"]) + 17,
							},
							onclick: () => {
								return;
							},
						},
						{
							type: "rect",
							shape: {
								x: pos,
								y: get(gridRect, ["y"]),
								width: get(gridRect, ["width"]) - pos + 10,
								height: get(gridRect, ["height"]),
							},
							style: {
								fill: "rgba(105, 177, 255, 0.32)",
								opacity: 0.5,
							},
						},
					];
					graphicRef.current = newGraphic;
					instance.setOption(
						{
							graphic: newGraphic,
						},
						{
							replaceMerge: ["graphic"],
						},
					);
				},
				// ondragend: (params: any) => {
				// 	if (isEmpty(dataHistogram)) return;
				// 	const pos = params.target.shape?.x1 + params.target.transform?.[4];
				// 	let thresholdVal = instance?.convertFromPixel({ xAxisIndex: 0 }, pos);
				// 	if (Number.isNaN(+thresholdVal)) return;
				// 	if (thresholdVal < dataHistogram?.min) {
				// 		thresholdVal = dataHistogram?.min;
				// 	}
				// 	if (thresholdVal > dataHistogram?.max) {
				// 		thresholdVal = dataHistogram?.max;
				// 	}
				// 	thresholdRef.current = thresholdVal;
				// 	setThreshold({
				// 		[currentSplitBy]: thresholdRef as any,
				// 	});
				// 	setInput(
				// 		(pre) =>
				// 			({
				// 				...pre,
				// 				// from: +(thresholdVal || 0)?.toFixed(5)
				// 				from: +thresholdVal || 0,
				// 			}) as InputBrush,
				// 	);
				// },
				style: {
					stroke: "#0A41AD",
					lineWidth: 2,
				},
				z: 9999,
			},
			{
				type: "rect",
				shape: shapeRect,
				style: {
					fill: "rgba(105, 177, 255, 0.32)",
					opacity: 0.5,
				},
			},
		];
		graphicRef.current = graphic;
		// if (isEmpty(initGraphicRef.current)) {
		// 	initGraphicRef.current = graphic;
		// }
		return graphic;
	};

	return <div id="echarts"></div>;
};

export default Histogram;
