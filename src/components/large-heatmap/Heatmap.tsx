import { OrthographicView } from "@deck.gl/core";
import { useMemo, useReducer, useRef, useState } from "react";
import HeatmapBitmapLayer from "./HeatmapBitmapLayer";

// Image texture dimensions
export const TILE_SIZE = 4096;

const LargeHeatmap = () => {
	const deckRef = useRef<any>(null);
	const [gl, setGlContext] = useState(null);
	const [tileIteration, incTileIteration] = useReducer((i) => i + 1, 0);

	const viewWidth = 100;
	const viewHeight = 100;
	const offsetLeft = 50;
	const offsetTop = 50;

	const matrixWidth = viewWidth - offsetLeft;
	const matrixHeight = viewHeight - offsetTop;

	const matrixLeft = -matrixWidth / 2;
	const matrixRight = matrixWidth / 2;
	const matrixTop = -matrixHeight / 2;
	const matrixBottom = matrixHeight / 2;

	const xTiles = Math.ceil(width / TILE_SIZE);
	const yTiles = Math.ceil(height / TILE_SIZE);

	const colormapRange = [0.0, 1.0];
	const colormap = "plasma";

	const tileWidth = 50;
	const tileHeight = 50;

	const heatmapLayers = useMemo(
		() => {
			function getLayer(i, j, tile) {
				return new HeatmapBitmapLayer({
					id: `heatmapLayer-${tileIteration}-${i}-${j}`,
					image: tile,
					bounds: [
						matrixLeft + j * tileWidth,
						matrixTop + i * tileHeight,
						matrixLeft + (j + 1) * tileWidth,
						matrixTop + (i + 1) * tileHeight,
					],
					aggSizeX,
					aggSizeY,
					colormap,
					colorScaleLo: colormapRange[0],
					colorScaleHi: colormapRange[1],
					// updateTriggers: {
					// 	image: [axisLeftLabels, axisTopLabels],
					// 	bounds: [tileHeight, tileWidth],
					// },
				});
			}
			const layers = tilesRef.current.map((tile, index) =>
				getLayer(Math.floor(index / xTiles), index % xTiles, tile),
			);
			return layers;
		},
		[
			// uint8ObsFeatureMatrix,
			// backlog.length,
			// transpose,
			// axisTopLabels,
			// axisLeftLabels,
			// paddedExpressions,
			// matrixLeft,
			// tileWidth,
			// matrixTop,
			// tileHeight,
			// yTiles,
			// xTiles,
			// aggSizeX,
			// aggSizeY,
			// colormap,
			// colormapRange,
			// tileIteration,
			// featureIndex,
		],
	);
	return (
		<DeckGL
			id={`deckgl-overlay`}
			ref={deckRef}
			onWebGLInitialized={setGlContext}
			views={[
				// Note that there are multiple views here,
				// but only one viewState.
				new OrthographicView({
					id: "heatmap",
					controller: true,
					x: offsetLeft,
					y: offsetTop,
					width: matrixWidth,
					height: matrixHeight,
				}),
				// new OrthographicView({
				// 	id: "axisLeft",
				// 	controller: false,
				// 	x: 0,
				// 	y: offsetTop,
				// 	width: axisOffsetLeft,
				// 	height: matrixHeight,
				// }),
				// new OrthographicView({
				// 	id: "axisTop",
				// 	controller: false,
				// 	x: offsetLeft,
				// 	y: 0,
				// 	width: matrixWidth,
				// 	height: axisOffsetTop,
				// }),
				// new OrthographicView({
				// 	id: "cellColorLabel",
				// 	controller: false,
				// 	x: transpose ? 0 : axisOffsetLeft,
				// 	y: transpose ? axisOffsetTop : 0,
				// 	width: transpose ? axisOffsetLeft : COLOR_BAR_SIZE * numCellColorTracks,
				// 	height: transpose ? COLOR_BAR_SIZE * numCellColorTracks : axisOffsetTop,
				// }),
				// ...cellColorsViews,
			]}
			layers={layers}
			layerFilter={layerFilter}
			getCursor={(interactionState) => (interactionState.isDragging ? "grabbing" : cursorType)}
			glOptions={DEFAULT_GL_OPTIONS}
			onViewStateChange={onViewStateChange}
			viewState={viewState}
			// onHover={onHover}
			useDevicePixels={useDevicePixels}
			// onClick={onHeatmapClick}
			width="100%"
			height="100%"
		/>
	);
};
