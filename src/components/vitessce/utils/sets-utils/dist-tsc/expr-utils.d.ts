/**
 * Input: selections and data.
 * Output: expression data in a hierarchy like
 * [
 *   {
 *     "selectedCellSet1": {
 *       "selectedSampleSet1": [],
 *     }
 *   },
 *   exprMax
 * ]
 * @param {*} sampleEdges
 * @param {*} sampleSets
 * @param {*} sampleSetSelection
 * @param {*} expressionData
 * @param {*} obsIndex
 * @param {*} mergedCellSets
 * @param {*} geneSelection
 * @param {*} cellSetSelection
 * @param {*} cellSetColor
 * @param {*} featureValueTransform
 * @param {*} featureValueTransformCoefficient
 * @returns
 */
export function stratifyArrays(sampleEdges: any, sampleIdToObsIdsMap: any, sampleSets: any, sampleSetSelection: any, obsIndex: any, mergedCellSets: any, cellSetSelection: any, arraysToStratify: any, featureAggregationStrategy: any): any[];
/**
 * Input: selections and data.
 * Output: expression data in a hierarchy like
 * [
 *   {
 *     "selectedCellSet1": {
 *       "selectedSampleSet1": [],
 *     }
 *   },
 *   exprMax
 * ]
 * @param {*} sampleEdges
 * @param {*} sampleSets
 * @param {*} sampleSetSelection
 * @param {*} expressionData
 * @param {*} obsIndex
 * @param {*} mergedCellSets
 * @param {*} geneSelection
 * @param {*} cellSetSelection
 * @param {*} cellSetColor
 * @param {*} featureValueTransform
 * @param {*} featureValueTransformCoefficient
 * @returns
 */
export function stratifyExpressionData(sampleEdges: any, sampleSets: any, sampleSetSelection: any, expressionData: any, obsIndex: any, mergedCellSets: any, geneSelection: any, cellSetSelection: any, cellSetColor: any, featureValueTransform: any, featureValueTransformCoefficient: any): any[];
/**
 * Supports three-level stratified input
 * (cell set, sample set, gene).
 * Returns two-level stratified output (cell set, sample set).
 * Aggregate stratified expression data so that there is
 * a single value for each (cell set, sample set) tuple.
 * I.e., aggregate along the gene axis.
 * @param {*} stratifiedResult
 * @param {*} geneSelection
 * @param {number|string} featureAggregationStrategy
 * @returns
 */
export function aggregateStratifiedExpressionData(stratifiedResult: any, geneSelection: any, featureAggregationStrategy: number | string): any;
//# sourceMappingURL=expr-utils.d.ts.map