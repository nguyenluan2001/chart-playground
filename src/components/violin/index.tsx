import * as echarts from "echarts";
import { useEffect } from "react";
import data from "./data.json"
import { flatMapDeep, max, min } from "lodash";
import * as d3 from "d3";

const palette = [
    '#688ae8',
    '#c33d69',
    '#2ea597',
    '#8456ce',
    '#e07941',
    '#3759ce',
    '#962249',
    '#096f64',
    '#6237a7',
    '#a84401',
    '#273ea5',
    '#780d35',
    '#03524a',
    '#4a238b',
    '#7e3103',
    '#1b2b88',
    '#ce567c',
    '#003e38',
    '#9469d6',
    '#602400',
    '#4066df',
    '#a32952',
    '#0d7d70',
    '#6b40b2',
    '#bc4d01',
    '#2c46b1',
    '#81143b',
    '#045b52',
    '#512994',
    '#8a3603',
    '#1f3191',
    '#da7596',
    '#01443e',
    '#a783e1',
    '#692801',
    '#5978e3',
    '#b1325c',
    '#1c8e81',
    '#7749bf',
    '#cc5f21',
    '#314fbf',
    '#8b1b42',
    '#06645a',
    '#59309d',
    '#983c02',
    '#23379b',
    '#6f062f',
    '#014b44',
    '#431d84',
    '#732c02'
]

interface IBox {
    lower_whisker: number,
    "q1": number,
    "q2": number,
    "q3": number,
    "upper_whisker": number,
    "min": number,
    "max": number,
    "mean": number
}
interface IKde {
    x: number[]
    y: number[]
}

interface IViolinData {
    [key: string]: {
        feature: string,
        layer: string,
        split_by_field: string,
        groups: {
            node: string,
            kde: IKde,
            box: IBox
        }[]
    }
}

const Violin = () => {
    const createViolinPoints = (kdeData: { x: number[], y: number[] }, index: number) => {
        const densityRange = [min(kdeData.y), max(kdeData.y)] as number[];
        const scaleDensity = d3.scaleLinear(densityRange, [0, 0.4]);
        const leftPoints = [];
        const rightPoints = [];
        for (let i = 0; i < 100; i++) {
            const x = kdeData.y[i];
            const y = kdeData.x[i];
            leftPoints.push([index * 2 + 1 - scaleDensity(x), y]);
            rightPoints.unshift([index * 2 + 1 + scaleDensity(x), y]);
        }
        return { leftPoints, rightPoints };
    };

    const generateColors = (
        colors: string[],
        num: number = 0,
        converter?: (color: string) => number[]
    ): any[] => {
        const n = colors?.length;
        if (!n) {
            return [];
        }
        const colorDiv = Number.parseInt(`${num / colors.length}`);
        const colorMod = num % colors.length;
        let result: any[] = [];
        for (let i = 1; i <= colorDiv; i++) {
            result = result.concat(colors);
        }
        result = result.concat([...colors].splice(0, colorMod));
        if (typeof converter === 'function') {
            return result?.map((item) => converter(item)) as any;
        }
        return result;
    };

    const createGrids = (data: Record<string, any>) => {
        let offset = 200
        const grids = []
        const gridHeight = 200
        for (const gene in data) {
            const geneData = data[gene]
            grids.push({
                show: true,
                top: offset,
                height: gridHeight,
                borderWidth: 1,
                borderColor: "#F4F4F5"
            })
            offset += gridHeight

        }
        return grids
    }

    const createYAxises = (data: Record<string, any>) => {
        const yAxises = []
        let gridIndex = 0
        for (const gene in data) {
            yAxises.push({
                name: gene,
                nameLocation: 'middle',
                nameTextStyle: {
                    color: "#434343"
                },
                nameGap: 30,
                gridIndex,
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(0, 0, 0, 0.16)',
                        width: 4
                    }
                },
                axisLabel: {
                    color: "#434343"
                }
            })
            gridIndex++

        }
        return yAxises
    }

    const createXAxises = (data: IViolinData) => {
        const xAxises = []
        let gridIndex = 0
        for (const gene in data) {
            const geneData = data[gene]
            xAxises.push({
                gridIndex,
                min: 0,
                max: geneData.groups.length * 2,
                // interval: 2,
                minInterval: 2,
                maxInterval: 2,
                position: 'bottom',
                splitLine: {
                    interval: 2
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    // show: gridIndex === 0,
                    show: true,
                    rotate: 45,
                    width: 200,
                    height: 20,
                    overflow: 'truncate',
                    ellipsis: '...',
                    color: "#434343",
                    // formatter: (value, index) => {
                    //     console.log("🚀 ===== createXAxises ===== value:", value, index);
                    //     return geneData?.groups?.[index - 1]?.node || value
                    // }
                }
            })
            gridIndex++

        }
        return xAxises
    }

    const createClusterLabel = (data: IViolinData) => {
        let xAxis = {}
        let series = {}
        let points = []
        const nGenes = Object.keys(data).length
        for (const gene in data) {
            const geneData = data[gene]
            const axisData = []
            for (let i = 0; i < geneData.groups.length * 2; i++) {
                axisData.push(i)
                points.push({
                    value: [i * 2 + 1, 0, geneData?.groups[i]?.node || ''],
                    symbolSize: [0, 0],
                    label: {
                        show: true,
                        rotate: 45,
                        width: 200,
                        height: 20,
                        overflow: 'truncate',
                        ellipsis: '...',
                        align: 'left',
                        offset: [20, -15],
                        formatter: (params) => {
                            return params?.value[2]
                        }
                    }
                })
            }

            xAxis = {
                type: 'value',
                boundaryGap: false,
                min: 0,
                max: geneData.groups.length * 2,
                interval: 1,
                gridIndex: 0,
                position: 'top',
                axisLabel: {
                    show: false,
                    rotate: 325,
                    width: 200,
                    height: 20,
                    overflow: 'truncate',
                    ellipsis: '...',
                    color: "red",
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(0, 0, 0, 0.16)',
                        width: 4
                    }
                },
                splitLine: {
                    show: false
                }
            }
            series = {
                type: 'scatter',
                data: points,
                xAxisIndex: [nGenes],
                yAxisIndex: [nGenes],
            }



            break
        }
        return { xAxis, yAxis: { gridIndex: 0, data: [0, 1], show: true, inverse: true, boundaryGap: false }, series }
    }

    const createColor = (data: IViolinData) => {
        let colors: string[] = []
        for (const gene in data) {
            const geneData = data[gene]
            colors = colors.concat(generateColors(palette, geneData.groups.length))
        }
        return colors
    }

    const createSeries = (data: IViolinData) => {
        const series = []
        let gridIndex = 0
        for (const gene in data) {
            const geneData = data[gene]
            const { clusters, boxes, kdes } = geneData?.groups?.reduce<{
                clusters: string[]
                boxes: IBox[]
                kdes: IKde[]
            }>((pre, current) => {
                pre.clusters.push(current.node)
                pre.boxes.push(current.box)
                pre.kdes.push(current.kde)
                return pre
            }, { clusters: [], boxes: [], kdes: [] })
            series.push(
                kdes.map((kde, index) => {
                    const { leftPoints, rightPoints } = createViolinPoints(kde, index)
                    return {
                        data: [...leftPoints, ...rightPoints, leftPoints[0]],
                        colorBy: 'series',
                        type: "line",
                        smooth: true,
                        areaStyle: {
                            // color: "rgba(104, 138, 232, 1)",
                        },
                        symbol: "none",
                        yAxisIndex: [gridIndex],
                        xAxisIndex: [gridIndex]
                    }
                })
            )
            gridIndex++
        }
        return flatMapDeep(series)
    }

    const createDataZoomYAxis = (totalGrid: number) => {
        const grid = {
            show: true,
            top: 200,
            height: 800,
            borderWidth: 1,
            borderColor: "#F4F4F5"
        }

        const xAxis = {
            min: 0,
            max: totalGrid,
            interval: 1,
            gridIndex: totalGrid,
            splitLine: {
                show: false
            }
        }
        const yAxis = {
            min: 0,
            max: totalGrid,
            interval: 1,
            gridIndex: totalGrid,
            splitLine: {
                show: false
            }
        }
        return { grid, xAxis, yAxis }
    }
    const onRender = () => {
        const dom = document.getElementById("echarts");
        const myChart = echarts.init(dom, null, {
            renderer: "canvas",
            useDirtyRect: false,
            width: 1500,
            height: 800,
        });


        const grids = createGrids(data)
        const yAxises = createYAxises(data)
        const xAxises = createXAxises(data)
        const colors = createColor(data)
        const { xAxis: clusterLabelXAxis, yAxis: clusterLabelYAxis, series: clusterLabelSeries } = createClusterLabel(data)
        const { grid: dataZoomGrid, xAxis: dataZoomXAxis, yAxis: dataZoomYAxis } = createDataZoomYAxis(grids.length)

        const mergedGrids = [...grids, dataZoomGrid]
        const mergedXAxis = [...xAxises, clusterLabelXAxis, dataZoomXAxis]
        const mergedYAxis = [...yAxises, clusterLabelYAxis, dataZoomYAxis]

        const option: echarts.EChartsOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            grid: mergedGrids,
            xAxis: mergedXAxis,
            yAxis: mergedYAxis,
            // xAxis: [clusterLabelXAxis],
            // yAxis: [clusterLabelYAxis],
            color: colors,
            // series: [
            //     {
            //         type: 'scatter',
            //         data: Array(8).fill(0)
            //     }
            // ]
            series: [...createSeries(data), clusterLabelSeries],
            dataZoom: [
                {
                    id: 'dataZoomXSlider',
                    type: 'slider',
                    showDetail: true,
                    xAxisIndex: mergedXAxis?.reduce<number[]>((pre, current, index) => {
                        if (index === mergedXAxis.length - 1) return pre
                        pre.push(index)
                        return pre
                    }, []),
                    filterMode: 'none',
                    startValue: 0,
                    endValue: mergedXAxis.length * 2,
                    backgroundColor: 'white',
                    borderColor: '#d9d9d9',
                    fillerColor: '#d9d9d9',
                    dataBackground: {
                        lineStyle: {
                            color: 'transparent'
                        },
                        areaStyle: {
                            color: 'transparent'
                        }
                    },
                    height: 5,
                    brushSelect: false,
                    moveOnMouseWheel: true,
                    zoomOnMouseWheel: false,
                    minValueSpan: 16,
                    maxValueSpan: 16,
                },
                // {
                //     id: 'dataZoomYSlider',
                //     type: 'slider',
                //     showDetail: true,
                //     // yAxisIndex: mergedYAxis.length - 1,
                //     yAxisIndex: mergedYAxis?.map((item, index) => index),
                //     filterMode: 'none',
                //     startValue: 0,
                //     endValue: mergedGrids.length,
                //     backgroundColor: 'white',
                //     borderColor: '#d9d9d9',
                //     fillerColor: '#d9d9d9',
                //     dataBackground: {
                //         lineStyle: {
                //             color: 'transparent'
                //         },
                //         areaStyle: {
                //             color: 'transparent'
                //         }
                //     },
                //     width: 5,
                //     height: 500,
                //     brushSelect: false,
                //     moveOnMouseWheel: true,
                //     zoomOnMouseWheel: false,
                //     minValueSpan: 1,
                //     maxValueSpan: 1,
                // },
            ]
        };;

        console.log("🚀 ===== onRender ===== option:", option);
        myChart.setOption(option);
        // Snap to integer
        // myChart.on('dataZoom', function (params) {
        //     const dz = myChart.getOption().dataZoom[0];

        //     const start = Math.round(dz.startValue);
        //     const end = Math.round(dz.endValue);

        //     myChart.setOption({
        //         dataZoom: [{
        //             startValue: start,
        //             endValue: end
        //         }]
        //     });
        // });
    };
    useEffect(() => {
        onRender()
    }, [])
    return <div id="echarts" className="mt-5 h-[500px]" />
}
export default Violin