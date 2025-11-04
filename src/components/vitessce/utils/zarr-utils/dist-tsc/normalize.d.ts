import type { ZipInfo } from 'unzipit';
type ZarrOpenRootOptions = {
    requestInit?: RequestInit;
    refSpecUrl?: string;
};
export declare function transformEntriesForZipFileStore(entries: ZipInfo['entries']): {
    [key: string]: import("unzipit").ZipEntry;
};
export declare function zarrOpenRoot(url: string, fileType: null | string, opts?: ZarrOpenRootOptions): import("zarrita").Location<import("zarrita").AsyncReadable<unknown>>;
export {};
//# sourceMappingURL=normalize.d.ts.map