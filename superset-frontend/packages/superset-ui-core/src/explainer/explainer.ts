

type PluginOptions = {
    data: {
        datasetName: string;
        globalFilter: {
            $and: any[];
        };
    };
    targetFilter: OrFilter;
};

type OrFilter = {
    $or: [{
        [key: string]: {
            $gte: number;
            $lt: number;
        }
    }];
}

export type Plugin = {
    pluginName: string;
    pluginOptions: PluginOptions;
};


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
        x_axis:string,
        datasource_id: number): Plugin | undefined {

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
                        name: x_axis,
                        $gte: min,
                        $lt: max
                    
                }]
            }
            return [];
        })
        

        // Return a Plugin object with the selected data
        return {
            pluginName: 'explain',
            pluginOptions: {
                data: {
                    datasetName: 'selectedData',
                    globalFilter: {
                        $and: [],
                    },
                },
                targetFilter: {
                    $or: [
                        {
                            [targetFilter[0].name]: {
                                $gte: targetFilter[0].$gte,
                                $lt: targetFilter[0].$lt,
                            }
                        }
                    ]
                }
            },
        };
    }
}