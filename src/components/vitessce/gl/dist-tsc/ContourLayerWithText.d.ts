declare class ContourLayerWithText {
    /**
     * Construct line and text layers to render.
     * @returns {object[]} Array of DeckGL layers.
     */
    getLineAndTextLayers(): object[];
    /**
     * Overrides the ContourLayer renderLayers function,
     * so that the custom text/line layers can be
     * appended to the contour line/polygon layers.
     * @returns {object[]} Array of DeckGL layers.
     */
    renderLayers(): object[];
}
declare namespace ContourLayerWithText {
    export let layerName: string;
    export { defaultProps };
}
export default ContourLayerWithText;
declare namespace defaultProps {
    namespace obsSetPath {
        let type: string;
    }
    namespace sampleSetPath {
        let type_1: string;
        export { type_1 as type };
    }
    namespace circleInfo {
        let type_2: string;
        export { type_2 as type };
    }
    namespace circlePointSet {
        let type_3: string;
        export { type_3 as type };
    }
    namespace obsSetLabelsVisible {
        let type_4: string;
        export { type_4 as type };
    }
    namespace obsSetLabelSize {
        let type_5: string;
        export { type_5 as type };
        export let min: number;
        export let max: number;
        export let value: number;
    }
    namespace cellSize {
        let type_6: string;
        export { type_6 as type };
        let min_1: number;
        export { min_1 as min };
        let max_1: number;
        export { max_1 as max };
        let value_1: number;
        export { value_1 as value };
    }
    namespace getPosition {
        let type_7: string;
        export { type_7 as type };
        export function value_2(x: any): any;
        export { value_2 as value };
    }
    namespace getWeight {
        let type_8: string;
        export { type_8 as type };
        let value_3: number;
        export { value_3 as value };
    }
    let gpuAggregation: boolean;
    let aggregation: string;
    namespace contours {
        let type_9: string;
        export { type_9 as type };
        let value_4: {
            threshold: number;
        }[];
        export { value_4 as value };
        export let optional: boolean;
        export let compare: number;
    }
    let zOffset: number;
}
//# sourceMappingURL=ContourLayerWithText.d.ts.map