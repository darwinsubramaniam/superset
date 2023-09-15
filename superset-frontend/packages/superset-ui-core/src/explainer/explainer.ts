

//  This is just part of the explain options, is not fullfleged 
//  this focus on the histogram use case with one dimension and one metric
type ExplainOptions = {
    data: {
        dataset_id: number;
    };
    targetFilter: OrFilter;
};

type OrFilter = {
    OR: [{
        [key: string]: {
            gte: number;
            lt: number;
        }
    }];
}


export interface BrushSelectedDataIndex {
    name:string,
    dataIndex: number[]
}

export interface Series {
    name:string,
    data: number[][];
}


export class Explainer {

    // optimised for historgram
    public execute(
        selectedDataIndex:BrushSelectedDataIndex[],
        allSeries: Series[],
        xAxis:string,
        datasetId: number): ExplainOptions | undefined {

        const selectedDatas = allSeries.map(series => {
            const selectedDataIndexForGivenSeriesName  = selectedDataIndex
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
                        name: xAxis,
                        $gte: min,
                        $lt: max
                    
                }]
            }
            return [];
        })
        

        // Return a Plugin object with the selected data
        return {
                data: {
                    dataset_id: datasetId
                },
                targetFilter: {
                    OR: [
                        {
                            [targetFilter[0].name]: {
                                gte: targetFilter[0].$gte,
                                lt: targetFilter[0].$lt,
                            }
                        }
                    ]
                }
            };
    }
}