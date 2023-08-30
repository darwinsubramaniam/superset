from flask import Response
from superset.views.base_api import BaseSupersetModelRestApi
from flask_appbuilder.models.sqla.interface import SQLAInterface
from superset.models.slice import Slice
from flask_appbuilder.api import expose

class AnalysesRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Slice)

    resource_name = "analysis"
    
    # this endpoint will be group in the Analysis section of swagger
    openapi_spec_tag = "Analysis"

    @expose("/", methods=["POST"])
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
        return self.response(200, message="POST OK")


