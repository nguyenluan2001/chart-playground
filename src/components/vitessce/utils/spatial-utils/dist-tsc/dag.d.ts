export class DAG {
    /**
       * DAG constructor.
       * @param {{ from: string, to: string, attributes: any}[]} edges
       */
    constructor(edges: {
        from: string;
        to: string;
        attributes: any;
    }[]);
    /**
     * Adjacency list representation of the DAG.
     * Maps each input to an array of outputs.
     * @type {Map<string, string[]>}
     */
    graph: Map<string, string[]>;
    /**
     * Mapping from [from, to] pairs to edge data.
     * @type {InternMap<[string, string], any>}
     */
    edgeData: InternMap<[string, string], any>;
    /**
     * Find a path from start to end using DFS.
     * @param {string} start
     * @param {string} end
     * @returns {{ from: string, to: string, attributes: any }[] | null} Returns
     * the path as an array of edges or null if no path exists.
     */
    findPath(start: string, end: string): {
        from: string;
        to: string;
        attributes: any;
    }[] | null;
}
//# sourceMappingURL=dag.d.ts.map