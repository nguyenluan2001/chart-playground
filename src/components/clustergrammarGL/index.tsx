// HeatmapMatrix.js
import { Layer, OrthographicView } from "@deck.gl/core";
// import { DeckGL, DeckGLRef } from "deck.gl";
import { DeckGL } from "@deck.gl/react";
// import GL from "@luma.gl/constants";
import { Geometry, Model } from "@luma.gl/engine";
import { useMemo, useRef, useState } from "react";
import { webgl2Adapter } from "@luma.gl/webgl";
import { luma } from "@luma.gl/core";
luma.registerAdapters([webgl2Adapter]);

// === 1️⃣ Shaders ===

// === 2️⃣ Custom Layer ===
export class HeatmapMatrixLayer extends Layer {
	initializeState() {
		const { device } = this.context;
		console.log("device", device);
		if (!device) return; // ✅ device not ready yet (important guard)
		const vs = `#version 300 es
		in vec2 positions;
		void main(void) {
		  gl_Position = vec4(positions, 0.0, 1.0);
		}`;
		const fs = `#version 300 es
		precision highp float;
		out vec4 fragColor;
		void main(void) {
		  fragColor = vec4(1.0, 0.0, 0.0, 1.0);
		}`;
		// rectangle (two triangles) in NDC coords
		const positions = new Float32Array([
			-0.25, -0.25, 0.25, -0.25, 0.25, 0.25, -0.25, -0.25, 0.25, 0.25, -0.25, 0.25,
		]);
		// Create a Model (engine helper) — easier than raw pipeline for simple draws
		const model = new Model(device, {
			vs,
			fs,
			geometry: new Geometry({
				drawMode: "triangle-list",
				attributes: {
					positions,
				},
			}),
			// no bindings/uniforms necessary for a solid color rectangle
		});
		this.state.model = model;
	}

	draw() {
		const { device } = this.context;
		const { model } = this.state;
		console.log("device", device);

		if (!device) return; // ✅ device not ready yet (important guard)

		// begin a render pass (defaults to canvas/framebuffer)
		const renderPass = device.beginRenderPass({
			// optional: clearColor: [0,0,0,0],
		});

		// draw the model into the render pass
		model.draw(renderPass);

		// finish and submit
		renderPass.end();
		device.submit();
	}

	finalizeState() {
		this.state.model?.destroy();
	}
}

// === 3️⃣ React Component ===
export default function HeatmapMatrix() {
	const [hover, setHover] = useState(null);
	const deckRef = useRef<any>(null);
	const nGenes = 4; // rows
	const nCells = 5; // cols

	// const createFlattenMatrix = () => {
	// 	const expressionMatrix = [
	// 		// Gene1
	// 		[0.1, 0.3, 0.0, 0.9, 0.4],
	// 		// Gene2
	// 		[0.0, 0.0, 0.2, 0.8, 0.7],
	// 		// Gene3
	// 		[0.5, 0.7, 0.3, 0.1, 0.0],
	// 		// Gene4
	// 		[0.9, 0.8, 0.4, 0.0, 0.1],
	// 	];
	// 	const numGenes = 4;
	// 	const numCells = 5;

	// 	const flatData = new Float32Array(numGenes * numCells);
	// 	let index = 0;
	// 	for (let i = 0; i < numGenes; i++) {
	// 		for (let j = 0; j < numCells; j++) {
	// 			flatData[index++] = expressionMatrix[i][j];
	// 		}
	// 	}
	// 	return flatData;
	// };

	// const createTexture = async () => {
	// 	try {
	// 		if (!deckRef.current) return;
	// 		const device = deckRef.current.deck?.device;
	// 		const texture = device?.createTexture({
	// 			width: nCells,
	// 			height: nGenes,
	// 			format: "r32float", // or other appropriate format
	// 			// dataFormat: "r", // single channel
	// 			// type: "float32", // if supported
	// 			data: createFlattenMatrix(),
	// 		});
	// 		console.log("🚀 ===== createTexture ===== texture:", texture);
	// 		return texture;
	// 	} catch (error) {
	// 		console.log("error", error);
	// 	}
	// 	// const texture2 = new Texture(gl, {
	// 	// 	data: createFlattenMatrix(),
	// 	// 	width: 5, // number of columns
	// 	// 	height: 4, // number of rows
	// 	// 	format: gl.R32F,
	// 	// 	type: gl.FLOAT,
	// 	// 	parameters: {
	// 	// 		[gl.TEXTURE_MIN_FILTER]: gl.NEAREST,
	// 	// 		[gl.TEXTURE_MAG_FILTER]: gl.NEAREST,
	// 	// 	},
	// 	// });
	// };

	// Example 128×128 matrix with random values
	// const { texture, min, max } = useMemo(() => {
	// 	const size = 128;
	// 	const data = new Float32Array(size * size);
	// 	for (let i = 0; i < data.length; i++) data[i] = Math.random();
	// 	const gl = document.createElement("canvas").getContext("webgl2");
	// 	const tex = gl.createTexture();
	// 	gl.bindTexture(gl.TEXTURE_2D, tex);
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, size, size, 0, gl.RED, gl.FLOAT, data);
	// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	// 	return { texture: tex, min: 0, max: 1 };
	// }, []);
	// genes × cells (4 × 5)

	const heatmapLayer = useMemo(() => {
		if (!deckRef.current) return [];
		return new HeatmapMatrixLayer({
			id: "heatmap",
		});
	}, [deckRef.current]);

	const createDevice = async () => {
		return await luma.createDevice({ type: "webgl" });
	};

	return (
		<DeckGL
			// layers={[heatmapLayer]}
			// viewState={{
			// 	target: [0, 0],
			// 	zoom: 0,
			// 	minZoom: -5,
			// 	maxZoom: 20,
			// }}
			initialViewState={{
				target: [0, 0, 0],
				zoom: 0,
			}}
			views={
				new OrthographicView({
					id: "detail",
					flipY: false,
				})
			}
			controller={false}
			ref={deckRef}
			// onHover={({ x, y, coordinate }) => setHover(`x:${x}, y:${y}`)}
			style={{ width: "100vw", height: "100vh" }}
			deviceProps={{
				type: "webgl",
			}}
			device={createDevice()}
		>
			{hover && (
				<div
					style={{
						position: "absolute",
						top: 10,
						left: 10,
						background: "rgba(0,0,0,0.7)",
						color: "white",
						padding: "4px 8px",
						borderRadius: "4px",
					}}
				>
					{hover}
				</div>
			)}
		</DeckGL>
	);
}
