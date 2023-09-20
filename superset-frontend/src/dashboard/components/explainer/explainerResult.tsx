export interface ExplainerResult{
    columnName:string,
    effectiveness:number,
    filter: {
        class:string
    }
    filterDescription:string
    fitness:number
    support:number
}

export interface ExplainerResultModalProps{
    results:ExplainerResult[]
}

/*
 "{\n \"json\": {\n \"message\": \"[{\\\"columnName\\\":\\\"class\\\",\\\"effectiveness\\\":3.0000000000000004,\\\"filter\\\":{\\\"class\\\":\\\"Iris-virginica\\\"},\\\"filterDescription\\\":\\\"class == Iris-virginica\\\",\\\"fitness\\\":4.03030303030303,\\\"support\\\":1.0}]\\n\"\n },\n \"response\": {}\n}"
*/

export const ExplainerResultModal= ({results}:ExplainerResultModalProps) => {
    console.log(results)
    return (
        //each explainer result
        <div>
            {results.map((result) => {
                return (
                    <EachExplainerResult
                        effectiveness={result.effectiveness}
                        filterDescription={result.filterDescription}
                        support={result.support} columnName={""} filter={{
                            class: ""
                        }} fitness={0}                        
                        />
                )
            })}
        </div>

    )

}

const EachExplainerResult = ({filterDescription, effectiveness, support,...rest}:ExplainerResult) => {

    
    return (
        <div>
            <p>{filterDescription}</p>
            <p>explain {(support * 100).toFixed(2)}% of the selected data</p>
            <p>the explanation is {effectiveness.toFixed(5)} times better than random.</p>
        </div>
    )
}