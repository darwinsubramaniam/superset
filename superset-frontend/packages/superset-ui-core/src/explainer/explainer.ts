

//  This is just part of the explain options, is not fullfleged 

import { SupersetClient } from "..";

//  this focus on the histogram use case with one dimension and one metric
type ExplainPayload = {
    data: {
        dataset_id: number;
    };
    targetFilter: OrFilter;
};

type OrFilter = {
    OR: {
        [key: string]: {
            gte: number;
            lt: number;
        }
    };
}

export interface BrushSelectedDataIndex {
    name: string,
    dataIndex: number[]
}

export interface Series {
    name: string,
    data: number[][];
}

export interface ExplainerData {
    brushSelectedDataIndex: BrushSelectedDataIndex[],
    allSeries: Series[],
    xAxis: string,
    datasetId: number
}


// export class Explainer {


//     // optimised for historgram
//     public payload(data:ExplainerData): ExplainPayload | undefined {

//         const selectedDatas = data.allSeries.map(series => {
//             const selectedDataIndexForGivenSeriesName  = data.brushSelectedDataIndex
//             .find(i => i.name == series.name)?.dataIndex || [];

//             // Get all the series's data which is part of the selectedDataIndex of dataIndex
//             const selectedSeriesData = series.data.filter((_, index) => 
//                 selectedDataIndexForGivenSeriesName.includes(index));

//             return selectedSeriesData.length ? selectedSeriesData : undefined
//         });

//         const targetFilter = selectedDatas.flatMap(x => {
//             if (x) {

//                 const min = Math.min(...x.map(arr => arr[0]));
//                 const max = Math.max(...x.map(arr => arr[0]))
//                 return [{
//                         name: data.xAxis,
//                         $gte: min,
//                         $lt: max

//                 }]
//             }
//             return [];
//         })


//         // Return a Plugin object with the selected data
//         return {
//                 data: {
//                     dataset_id: data.datasetId
//                 },
//                 targetFilter: {
//                     OR: [
//                         {
//                             [targetFilter[0].name]: {
//                                 gte: targetFilter[0].$gte,
//                                 lt: targetFilter[0].$lt,
//                             }
//                         }
//                     ]
//                 }
//             };
//     }

//     public execute(payload:ExplainPayload) {
//         await SupersetClient.post({})
//     }
// }

// get the payload from the data
export function getPayload(data: ExplainerData): ExplainPayload {
    const selectedDatas = data.allSeries.map(series => {
        const selectedDataIndexForGivenSeriesName = data.brushSelectedDataIndex
            .find(i => i.name == series.name)?.dataIndex || [];

        // Get all the series's data which is part of the selectedDataIndex of dataIndex
        const selectedSeriesData = series.data.filter((_, index) =>
            selectedDataIndexForGivenSeriesName.includes(index));

        return selectedSeriesData.length ? selectedSeriesData : undefined
    });

    const targetFilter = selectedDatas.flatMap(x => {
        if (x) {

            const min = Math.min(...x.map(arr => arr[0]));
            const max = Math.max(...x.map(arr => arr[0]))
            return [{
                name: data.xAxis,
                $gte: min,
                $lt: max

            }]
        }
        return [];
    })


    // Return a Plugin object with the selected data
    return {
        data: {
            dataset_id: data.datasetId
        },
        targetFilter: {
            OR:
            {
                [targetFilter[0].name]: {
                    gte: targetFilter[0].$gte,
                    lt: targetFilter[0].$lt,
                }
            }

        }
    };

}

// execute the api call to the backend
export function execute(payload: ExplainPayload) {
    return SupersetClient.post({
        endpoint: '/api/v1/analysis',
        jsonPayload: payload,
    });
}

export const Explainer = {
    getPayload,
    execute
}