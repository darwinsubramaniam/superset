import { BrushSelectedDataIndex, Explainer, Series } from "./explainer"


describe("Explain" , () => {
    let explainer:Explainer

    beforeEach(() => {
        explainer = new Explainer()
    })


    it('historgram single category', () => {
        const mockXAxis = "sepal_length";
        const mockDatasetId = 1;
        const mockSelectedDataIndex: BrushSelectedDataIndex[] = [
            {
                name: "COUNT(*)",
                dataIndex: [30, 31, 32, 33, 34]
            }
        ];

        const mockAllSeries: Series[] = [
            {
                name: "COUNT(*)",
                data: [
                    [
                        4.3,
                        1
                    ],
                    [
                        4.4,
                        3
                    ],
                    [
                        4.5,
                        1
                    ],
                    [
                        4.6,
                        4
                    ],
                    [
                        4.7,
                        2
                    ],
                    [
                        4.8,
                        5
                    ],
                    [
                        4.9,
                        6
                    ],
                    [
                        5,
                        10
                    ],
                    [
                        5.1,
                        9
                    ],
                    [
                        5.2,
                        4
                    ],
                    [
                        5.3,
                        1
                    ],
                    [
                        5.4,
                        6
                    ],
                    [
                        5.5,
                        7
                    ],
                    [
                        5.6,
                        6
                    ],
                    [
                        5.7,
                        8
                    ],
                    [
                        5.8,
                        7
                    ],
                    [
                        5.9,
                        3
                    ],
                    [
                        6,
                        6
                    ],
                    [
                        6.1,
                        6
                    ],
                    [
                        6.2,
                        4
                    ],
                    [
                        6.3,
                        9
                    ],
                    [
                        6.4,
                        7
                    ],
                    [
                        6.5,
                        5
                    ],
                    [
                        6.6,
                        2
                    ],
                    [
                        6.7,
                        8
                    ],
                    [
                        6.8,
                        3
                    ],
                    [
                        6.9,
                        4
                    ],
                    [
                        7,
                        1
                    ],
                    [
                        7.1,
                        1
                    ],
                    [
                        7.2,
                        3
                    ],
                    [
                        7.3,
                        1
                    ],
                    [
                        7.4,
                        1
                    ],
                    [
                        7.6,
                        1
                    ],
                    [
                        7.7,
                        4
                    ],
                    [
                        7.9,
                        1
                    ]
                ]
            }
        ];

        

        const result = explainer.execute(mockSelectedDataIndex, mockAllSeries, mockXAxis, mockDatasetId);
        console.log(JSON.stringify(result, null, 2));
        
    })
})