import { ExplainPayload } from "packages/superset-ui-core/src/explainer/explainer";

export const ExplainerSelection = ({ data, targetFilter }: ExplainPayload) => {
    let represenation = "No Representation";

    console.log("targetFilter : " + JSON.stringify(targetFilter));

    const orKey = Object.keys(targetFilter)[0]
    console.log("Or Key : " + orKey);
    const orElementValue = targetFilter[orKey];

    const firstElementKeys = Object.keys(orElementValue);
    console.log("First Element Keys : " + JSON.stringify(firstElementKeys));
    const firstElement = orElementValue[firstElementKeys[0]];
    console.log("First Element : " + JSON.stringify(firstElement));


    if(firstElement?.gte && firstElement?.lte){
       represenation = `((${firstElementKeys} >= ${firstElement.gte}) AND (${firstElementKeys} <= ${firstElement.lte}))`
    }



    return (
        <p>{represenation}</p>
    )
}