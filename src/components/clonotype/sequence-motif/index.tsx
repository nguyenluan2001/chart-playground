import * as d3 from "d3";
import { last } from "lodash";
import { useEffect, useRef } from "react";
import rawData from "./data.json";
import paths from "./paths.json";
const CHART_ID = "motif";
const WIDTH = 576;
const HEIGHT = 210;
const PADDING = 20;
const COLOR_SCHEME = {
	A: "black",
	C: "green",
	T: "green",
	G: "green",
	D: "red",
	E: "red",
	F: "black",
	H: "blue",
	I: "black",
	K: "blue",
	L: "black",
	M: "black",
	N: "purple",
	P: "black",
	Q: "purple",
	R: "blue",
	S: "green",
	V: "black",
	W: "black",
	Y: "green",
};
const LETTER_SIZE = [46, 54];
const LETTER_SCALE_WIDTH = 0.5;
const ClonotypeMotif = () => {
	const svgRef = useRef<SVGSVGElement>(null);
	const yOffsetRef = useRef(new Map());
	const x = d3
		.scaleLinear()
		.domain([0, 15])
		.nice()
		.range([PADDING, WIDTH - PADDING * 2]);

	const y = d3
		.scaleLinear()
		.domain([4, 0])
		.range([PADDING, HEIGHT - PADDING]);
	console.log("x(0)", x(0));
	console.log("x(1)", x(1));

	const renderXAxis = (
		svg: d3.Selection<SVGSVGElement, undefined, null, undefined>,
		isUpdate = false,
	) => {
		let selection: d3.Selection<d3.BaseType, undefined, null, undefined> | null = null;
		selection = svg.append("g").attr("id", "x-axis") as any;

		if (!selection) return;
		return selection
			.attr("transform", `translate(0, ${HEIGHT - PADDING})`)
			.call(d3.axisBottom(x).ticks(14) as any)
			.call((g) =>
				g
					.selectAll(".tick text")
					.attr("style", "font-size:16px")
					.text((d) => {
						if (d === 0) return "";
						return d - 1;
					}),
			)
			.call((g) =>
				g
					.selectAll(".tick line")
					.clone()
					.attr("y2", -HEIGHT)
					.attr("stroke-opacity", 1)
					.attr("stroke-width", 2)
					.attr("stroke", "#ffffff"),
			);
	};

	const renderYAxis = (
		svg: d3.Selection<SVGSVGElement, undefined, null, undefined>,
		isUpdate = false,
	) => {
		let selection: d3.Selection<d3.BaseType, undefined, null, undefined> | null = null;
		selection = svg.append("g").attr("id", "y-axis") as any;

		if (!selection) return;
		return selection
			.attr("transform", `translate(${PADDING},0)`)
			.call(d3.axisLeft(y).ticks(4) as any)
			.call((g) => g.selectAll(".tick text").attr("style", "font-size:16px"))
			.call((g) => g.attr("x2", WIDTH).attr("stroke-opacity", 1).attr("stroke-width", 2));
	};
	const renderContainer = () => {
		return d3
			.create("svg")
			.attr("id", CHART_ID)
			.attr("width", WIDTH)
			.attr("height", HEIGHT)
			.attr("style", "max-width: 100%; max-height: 100%;background:#e6f4ff")
			.on("dblclick.zoom", null);
	};

	const calculateCenterLetter = (letter) => {
		switch (letter) {
			case "I": {
				return (20 * LETTER_SCALE_WIDTH) / 2;
			}
			default: {
				return (LETTER_SIZE[0] * LETTER_SCALE_WIDTH) / 2;
			}
		}
	};

	const onDrawLetter = (svg) => {
		const scaleHeight = d3.scaleLinear([0, 4], [PADDING, HEIGHT - PADDING]);
		const calculateScale = (freq) => {
			console.log("scaleHeight", scaleHeight(freq));
			return (scaleHeight(freq) - scaleHeight(0)) / LETTER_SIZE[1];
		};

		// const letters = [
		// 	[1, "C", 4, "green"],
		// 	[2, "A", 4, "black"],
		// 	[3, "A", 1, "black"],
		// 	[3, "V", 2, "black"],
		// 	[4, "Q", 0.5, "purple"],
		// 	[4, "P", 0.5, "black"],
		// 	[4, "N", 0.5, "purple"],
		// 	[4, "V", 1, "black"],
		// 	[5, "G", 0.25, "green"],
		// 	[5, "N", 0.25, "purple"],
		// 	[5, "I", 0.25, "black"],
		// 	[5, "T", 0.25, "green"],
		// 	[5, "A", 0.5, "black"],
		// 	[11, "Q", 0.5, "purple"],
		// 	[11, "N", 0.5, "purple"],
		// 	[11, "K", 2, "blue"],
		// ];
		const letters = [];
		for (let i = 0; i < rawData?.data?.length; i++) {
			for (const letter of rawData?.data?.[i]) {
				letters.push([i + 1, ...letter]);
			}
		}

		const selection = svg.append("g").attr("id", "letters").attr("width", WIDTH);
		return (
			selection
				.selectAll("path")
				.data(letters)
				.join("path")
				// .append("path")
				.attr("id", "letter_C")
				.attr("d", (d) => paths[d[1]])
				.style("fill", (d) => COLOR_SCHEME[d[1]])
				.attr("transform", (d) => {
					const colIdx = d[0];
					const colYOffset = yOffsetRef.current.get(colIdx);
					let yOffset = y(d[2]);

					if (!colYOffset) {
						yOffsetRef.current.set(colIdx, d[2]);
					} else {
						yOffset = y(colYOffset + d[2]);
						yOffsetRef.current.set(colIdx, colYOffset + d[2]);
					}

					return `translate(${x(d[0]) - calculateCenterLetter(d[1])},${yOffset}) scale(${LETTER_SCALE_WIDTH},${calculateScale(d[2])})`;
				})
		);
	};
	const onRender = () => {
		const svg = renderContainer();
		renderXAxis(svg);
		renderYAxis(svg);
		onDrawLetter(svg);
		if (!svgRef.current) return;
		svgRef.current.replaceWith(svg.node() as any);
	};
	useEffect(() => {
		onRender();
	}, []);
	return (
		<div className="w-fit p-[30px]">
			<p>Hello world</p>
			<svg id="motif" ref={svgRef} />
		</div>
	);
};
export default ClonotypeMotif;
