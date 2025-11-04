/**
 * Get a representative PixelSource from a loader object returned from
 * the Vitessce imaging loaders
 * @param {object} loader { data: (PixelSource[]|PixelSource), metadata, channels } object
 * @param {number | undefined} level Level of the multiscale loader from which to get a PixelSource
 * @returns {object} PixelSource object
 */
export function getSourceFromLoader(loader: object, level: number | undefined): object;
/**
 * Helper method to determine whether pixel data is interleaved and rgb or not.
 * @param {object} loader
 * @param {array|null} channels
 */
export function isRgb(loader: object, channels: array | null): boolean;
export function physicalSizeToMatrix(xSize: any, ySize: any, zSize: any, xUnit: any, yUnit: any, zUnit: any): Matrix4;
/**
 * @param {Array.<number>} shape loader shape
 */
export function isInterleaved(shape: Array<number>): boolean;
/**
 * Initialize the channel selections for an individual layer.
 * @param {object} loader A viv loader instance with channel names appended by Vitessce loaders
 * of the form { data: (PixelSource[]|PixelSource), metadata: Object, channels }
 * @returns {object[]} An array of selected channels with default
 * domain/slider settings.
 */
export function initializeLayerChannels(loader: object, use3d: any): object[];
/**
 * Given a set of image layer loader creator functions,
 * create loader objects for an initial layer or set of layers,
 * which will be selected based on default values predefined in
 * the image data file or otherwise by a heuristic
 * (the midpoint of the layers array).
 * @param {object[]} rasterLayers A list of layer metadata objects with
 * shape { name, type, url, createLoader }.
 * @param {(string[]|null)} rasterRenderLayers A list of default raster layers. Optional.
 */
export function initializeRasterLayersAndChannels(rasterLayers: object[], rasterRenderLayers: (string[] | null), usePhysicalSizeScaling: any): Promise<any[]>;
export function getNgffAxes(firstMultiscalesAxes: any): {
    type: string;
    name: string;
}[];
export function getNgffAxesForTiff(dimOrder: any): any;
/**
 * Get a 4x4 matrix that swaps axes.
 * TODO: add unit tests.
 * @param {("x"|"y"|"z")[]} inputAxes
 * @param {("x"|"y"|"z")[]} outputAxes
 * @return {number[][]} 4x4 matrix that swaps axes.
 */
export function getSwapAxesMatrix(inputAxes: ("x" | "y" | "z")[], outputAxes: ("x" | "y" | "z")[]): number[][];
/**
 * Convert an array of coordinateTransformations objects to a 16-element
 * plain JS array using Matrix4 linear algebra transformation functions.
 * @param {object[]|undefined} coordinateTransformations List of objects matching the
 * OME-NGFF v0.4 coordinateTransformations spec.
 * @param {object[]|undefined} axes Axes in OME-NGFF v0.4 format, objects
 * with { type, name }.
 * @returns {Matrix4} Array of 16 numbers representing the Matrix4.
 */
export function coordinateTransformationsToMatrix(coordinateTransformations: object[] | undefined, axes: object[] | undefined): Matrix4;
export function hexToRgb(hex: any): number[];
export function normalizeAxes(axes: any): any;
export function getIntrinsicCoordinateSystem(normAxes: any): any;
/**
 * Normalize coordinate transformations to the OME-NGFF v0.4 format,
 * despite potentially being in the new format proposed in
 * https://github.com/ome/ngff/pull/138 (As of 2023-09-02).
 * @param {object[]|undefined} coordinateTransformations Value of
 * multiscales[0].coordinateTransformations in either OME-NGFF v0.4 format
 * or that proposed in https://github.com/ome/ngff/pull/138.
 * @param {object[]} datasets Value of multiscales[0].datasets in OME-NGFF v0.4 format.
 * @returns {object[]} Array of coordinateTransformations in OME-NGFF v0.4 format.
 */
export function normalizeCoordinateTransformations(coordinateTransformations: object[] | undefined, datasets: object[]): object[];
/**
 * Convert coordinate transformations to a 4x4 matrix for SpatialData
 * spatial elements. This function is intended to be used with SpatialData
 * objects which have named coordinate systems. This function should
 * be compatible with any SpatialElement (shapes, points, labels, images).
 * @param {{
 *  axe?: (string[]|{ name: string, type?: string, unit?: string }[]),
 *  coordinateTransformations?: object[],
 *  datasets?: object[]
 * }} ngffMetadata For images/labels, this is multiscales[0] from .zattrs.
 * For shapes/points, this is { axes, coordinateTransformations } from .zattrs.
 * @param {string} targetCoordinateSystem A target coordinate system name.
 * @returns {Matrix4} A 4x4 transformation matrix.
 * This can later be multiplied with other matrices if needed.
 */
export function coordinateTransformationsToMatrixForSpatialData(ngffMetadata: {
    axe?: (string[] | {
        name: string;
        type?: string;
        unit?: string;
    }[]);
    coordinateTransformations?: object[];
    datasets?: object[];
}, targetCoordinateSystem: string): Matrix4;
export function getStatsForResolution(loader: any, resolution: any): {
    height: any;
    width: any;
    depth: any;
    depthDownsampled: number;
    totalBytes: number;
    dims: {
        [k: string]: any;
    };
};
export function canLoadResolution(loader: any, resolution: any): boolean;
import { Matrix4 } from 'math.gl';
//# sourceMappingURL=spatial.d.ts.map