from flask import Response, request
from jsonschema import ValidationError
from superset.views.base_api import BaseSupersetModelRestApi, requires_json
from flask_appbuilder.models.sqla.interface import SQLAInterface
from superset.models.slice import Slice
from flask_appbuilder.api import expose
from superset.analyse.schemas import AnalysisPostSchema
from superset.daos.dataset import DatasetDAO;
import requests;

class AnalysesRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Slice)

    add_model_schema = AnalysisPostSchema()

    resource_name = "analysis"
    
    # this endpoint will be group in the Analysis section of swagger
    openapi_spec_tag = "Analysis"

    @expose("/", methods=["POST"])
    @requires_json
    def post(self) -> Response:
        """Create a new analysis.
        ---
        post:
          summary: Create a new analysis
          requestBody:
            description: analysis schema
            required: true
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
          responses:
            201:
              description: analysis added
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      id:
                        type: number
                      result:
                        $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            403:
              $ref: '#/components/responses/403'
            422:
              $ref: '#/components/responses/422'
            500:
              $ref: '#/components/responses/500'
        """

        try:
            item = self.add_model_schema.load(request.json)
        except ValidationError as error:
            return self.response_400(message=error.message)
        
        dataset_id = item.get('data',{}).get('dataset_id')

        dataset_name = DatasetDAO.find_by_id(dataset_id)
        print("Dataset : " , dataset_name)
        
        target_filter = item.get('targetFilter', {})

        or_filter = target_filter.get('OR', {})


        sections = []

        for key, value in or_filter.items():
            xAxis = key
            gte = value.get('gte')
            lte = value.get('lte')
            print("xAxis: ", xAxis)
            print("gte: ", gte)
            print("lte: ", lte)
            sections.append({"xAxis":xAxis, "gte" :gte, "lte":lte, "dataset_name":dataset_name.to_json().get("table_name")})

       
        # let deal with only histogram first by having the or filter Item to be one 
        print(sections[0])

        #explainer_flask_url = "http://ec2-3-138-155-43.us-east-2.compute.amazonaws.com:8081/query"
        explainer_flask_url = "http://ec2-3-15-161-222.us-east-2.compute.amazonaws.com:8081/query"
        headers = {
      "Cache-Control": "no-cache",
      "Accept": "*/*",
      "User-Agent": "Fetch Client",
      "Accept-Encoding": "gzip, deflate",
      "Connection": "keep-alive",
      "Content-Type": "application/json"
      }

        payload = {
            "pluginOptions": {
                "data": {
                    "datasetName": sections[0]["dataset_name"]
                },
                "targetFilter": {
                    "$or": [
                        {
                            sections[0]['xAxis']: {
                                "$gte": sections[0]["gte"],
                                "$lte": sections[0]["lte"]
                            }
                        }
                    ]
                }
            }
        }

        response = requests.post(explainer_flask_url, json=payload,headers=headers)
        # Check the response
        if response.status_code != 200:
            print('POST /query status: ', response.status_code)
            print("response body ", response.text )
        else:
            print('Success!')

        
        

        return self.response(200, message=response.text)
        # return self.response(200, message=response)


