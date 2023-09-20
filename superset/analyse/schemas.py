
from jsonschema import ValidationError
from marshmallow import Schema , fields

class DatasetSchema(Schema):
    """
    Schema to specify the dataset id
    """
    dataset_id = fields.Integer(required=True)

class FilterItemSchema(Schema):
    """
    Schema to represent an item in the filter array
    """
    gte = fields.Number(required=True)
    lte = fields.Number(required=True)


class ORFilterSchema(Schema):
    """
    Schema to represent an OR filter
    """
    OR = fields.Dict(fields.String(required=True),fields.Nested(FilterItemSchema), required=True)

class AnalysisPostSchema(Schema):
    """
    Schema to add a new analysis
    """
    data = fields.Nested(DatasetSchema, required=True)
    targetFilter = fields.Nested(ORFilterSchema, required=True)


    



    