from flask import Response, request
from jsonschema import ValidationError
from superset.views.base_api import BaseSupersetModelRestApi, requires_json
from flask_appbuilder.models.sqla.interface import SQLAInterface
from superset.models.slice import Slice
from flask_appbuilder.api import expose
from superset.analyse.schemas import AnalysisPostSchema

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
        
        target_filter = item.get('targetFilter', [])

        or_filter = target_filter.get('OR', {})

        for key, value in or_filter.items():
            xAxis = key
            gte = value.get('gte', 0)
            lt = value.get('lt', 0)
            print("xAxis: ", xAxis)
            print("gte: ", gte)
            print("lt: ", lt)
        

        return self.response(200, message=item)


