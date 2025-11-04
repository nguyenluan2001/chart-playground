import type { AbstractImageWrapper, VivLoaderType, VivLoaderDataType, ImageOptions, ChannelObject, ResolutionObject, BoundingCube } from '@vitessce/types';
/**
 * A wrapper around the Viv loader, to provide a common interface for
 * all image file types.
 */
export default class ImageWrapper implements AbstractImageWrapper {
    vivLoader: VivLoaderType;
    options: ImageOptions;
    modelMatrix: number[] | null;
    constructor(vivLoader: VivLoaderType, options: ImageOptions);
    getType(): 'ome-tiff' | 'ome-zarr';
    hasPhysicalSize(): boolean;
    getData(): VivLoaderDataType;
    getModelMatrix(): number[];
    _getModelMatrix(): number[];
    getDefaultTargetT(): number;
    getDefaultTargetZ(): number;
    getName(): string;
    getNumChannels(): number;
    getChannelNames(): string[];
    getChannelIndex(channelSpecifier: string | number): number;
    getChannelObjects(): ChannelObject[];
    getDtype(): string | undefined;
    hasZStack(): boolean;
    hasTStack(): boolean;
    hasCStack(): boolean;
    hasDimZ(): boolean;
    hasDimT(): boolean;
    hasDimC(): boolean;
    getNumZ(): number;
    getNumT(): number;
    getNumC(): number;
    getNumResolutions(): number;
    isMultiResolution(): boolean;
    getMultiResolutionStats(): ResolutionObject[];
    /**
     * Compute an index of an array element returned by getMultiResolutionStats()
     * which corresponds to a "good" automatic target resolution to select.
     * In the future, we could make this more sophisticated, for example
     * to take into account the network speed.
     */
    getAutoTargetResolution(): number | null;
    getBoundingCube(): BoundingCube;
    isInterleaved(): boolean;
    getPhotometricInterpretation(): 'RGB' | 'BlackIsZero';
}
//# sourceMappingURL=ImageWrapper.d.ts.map