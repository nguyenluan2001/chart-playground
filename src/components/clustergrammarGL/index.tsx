// HeatmapMatrix.js
import { _mergeShaders, Layer, OrthographicView, project32 } from "@deck.gl/core";
// import { DeckGL, DeckGLRef } from "deck.gl";
import { DeckGL } from "@deck.gl/react";
// import GL from "@luma.gl/constants";
import { Geometry, Model } from "@luma.gl/engine";
import { useMemo, useRef, useState } from "react";
import { webgl2Adapter } from "@luma.gl/webgl";
import { luma } from "@luma.gl/core";
import { BitmapLayer, ScatterplotLayer } from "@deck.gl/layers";
// luma.registerAdapters([webgl2Adapter]);

// === 1️⃣ Shaders ===

// === 2️⃣ Custom Layer ===
class HeatmapMatrixLayer extends BitmapLayer {
	getShaders() {
		// ✅ Updated to GLSL 3.00 syntax
		return _mergeShaders(
			{
				vs: `#version 300 es
	    in vec2 positions;
	    out vec2 vTexCoord;
	    void main(void) {
	      vTexCoord = positions * 0.5 + 0.5;
		  vec2 uCenter = vec2(-0.5, 0.5);
		  vec2 pos = positions * 0.2 + uCenter; // scale + translate
	      gl_Position = vec4(pos, 0.0, 1.0);
	    }
	  `,
				fs: `#version 300 es
	    precision highp float;
	    out vec4 fragColor;
	    void main(void) {
	      fragColor = vec4(1.0, 1.0, 0.0, 1.0);  // 🔴 red fill
	    }
	  `,
				modules: [project32],
			},
			[],
		);
	}

	initializeState() {
		super.initializeState();

		const { device } = this.context;

		// Replace BitmapLayer’s model with a simple red rectangle quad
		this.setState({
			model: this.getModel(device),
		});
		this._createTexture();
	}

	getModel(device) {
		return super._getModel();
	}

	_createTexture() {
		const matrix = [
			[0.1, 0.5],
			[0.8, 0.2],
		];
		const { device } = this.context;

		if (!matrix || !device) return;

		const height = matrix.length;
		const width = matrix[0].length;
		const flat = matrix.flat();

		const data = new Uint8Array(flat.map((v) => Math.max(0, Math.min(1, v)) * 255));
		console.log("🚀 ===== HeatmapMatrixLayer ===== _createTexture ===== data:", data);

		// const texture = new Texture(device, {
		// 	width,
		// 	height,
		// 	format: "r8unorm",
		// 	mipmaps: false,
		// 	sampler: { magFilter: "nearest", minFilter: "nearest" },
		// 	data,
		// });

		const texture = device.createTexture({
			data,
			width,
			height,
			format: "r8unorm",
			// mipmaps: false,
			sampler: { magFilter: "nearest", minFilter: "nearest" },
		});
		this.setState({ texture });
	}

	draw(opts) {
		const { model, texture } = this.state;

		model?.shaderInputs.setProps({
			custom: {
				...opts.uniforms,
				// uSize: size,
				uCenter: [0.0, 0.0], // center of screen
				uSize: [0.3, 0.2],
				bitmapTexture: texture,
			},
		});
		model?.draw(this.context.renderPass);
	}
}

// === 3️⃣ React Component ===
export default function HeatmapMatrix() {
	const [hover, setHover] = useState(null);
	const deckRef = useRef<any>(null);
	console.log("deckRef", deckRef.current);
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
			id: "red-rect",
			bounds: [-1, -1, 1, 1], // [minX, minY, maxX, maxY]
			coordinateSystem: 1, // COORDINATE_SYSTEM.CARTESIAN
			size: 0.5,
		});
	}, [deckRef.current]);

	const createDevice = async () => {
		return await luma.createDevice({ type: "webgl" });
	};
	const layer = new ScatterplotLayer<any>({
		id: "ScatterplotLayer",
		data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json",

		stroked: true,
		getPosition: (d: any) => d.coordinates,
		getRadius: (d: any) => Math.sqrt(d.exits),
		getFillColor: [255, 140, 0],
		getLineColor: [0, 0, 0],
		getLineWidth: 10,
		radiusScale: 6,
		pickable: true,
	});
	const layerBitmap = new BitmapLayer({
		id: "BitmapLayer",
		bounds: [-122.519, 37.7045, -122.355, 37.829],
		image: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png",
		pickable: true,
	});

	return (
		<div className="w-[500px] h-[500px] relative bg-black">
			<DeckGL
				layers={[heatmapLayer]}
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
				// initialViewState={{
				// 	longitude: -122.4,
				// 	latitude: 37.74,
				// 	zoom: 11,
				// }}
				views={
					new OrthographicView({
						// id: "detail",
						// flipY: false,
					})
				}
				// controller={{
				// 	keyboard: false,
				// 	doubleClickZoom: false,
				// 	dragRotate: false,
				// 	touchRotate: false,
				// 	touchZoom: true,
				// }}
				ref={deckRef}
				// onHover={({ x, y, coordinate }) => setHover(`x:${x}, y:${y}`)}
				style={{ width: 500, height: 500 }}
				deviceProps={{
					type: "webgl",
				}}
				// device={createDevice()}
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
		</div>
	);
}
