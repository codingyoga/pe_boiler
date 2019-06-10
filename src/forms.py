from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired, Length, AnyOf
from jsonschema import validate



class LoginForm(FlaskForm):
    # email = PasswordField('email', validators=[InputRequired(message='A email is required'), AnyOf(values=['@gmail.com', '@outlook.com'])])
    username = StringField('username', validators=[InputRequired(message='A username is required'), Length(min=5, max=10, message='Must be bitween 5 to 10')])
    password = PasswordField('password', validators=[InputRequired(message='A password is required')])

class SchemaValidate():
    fee_discount_schema = {
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/root.json",
  "type": "array",
  "items": {
    "$id": "#/items",
    "type": "object",
    "required": [
      "name",
      "value",
      "is_percentage",
      "students"
    ],
    "properties": {
      "name": {
        "$id": "#/items/properties/name",
        "type": "string"
      },
      "value": {
        "$id": "#/items/properties/value",
        "type": "number"
      },
      "is_percentage": {
        "$id": "#/items/properties/is_percentage",
        "type": "boolean"
      },
      "students": {
        "$id": "#/items/properties/students",
        "type": "array",
        "items": {
          "$id": "#/items/properties/students/items",
          "type": "integer"
        }
      }
    }
  }
}
    fee_structure_schema = {
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "http://example.com/root.json",
        "type": "object",
        "required": [
            "name",
            "struture"
        ],
        "properties": {
            "name": {
                "$id": "#/properties/name",
                "type": "string",

            },

            "struture": {
                "$id": "#/properties/struture",
                "type": "array",
                "items": {
                    "$id": "#/properties/struture/items",
                    "type": "object",
                    "required": [
                        "fee_group_name",
                        "starting_date",
                        "due_date",
                        "date_with_fine",
                        "fine_amnt",
                        "fee_types"
                    ],
                    "properties": {
                        "fee_group_name": {
                            "$id": "#/properties/struture/items/properties/fee_group_name",
                            "type": "string",
                        },
                        "starting_date": {
                            "$id": "#/properties/struture/items/properties/starting_date",
                            "type": "string",
                            "format": "date"
                        },
                        "due_date": {
                            "$id": "#/properties/struture/items/properties/due_date",
                            "type": "string",
                            "format": "date"
                        },
                        "date_with_fine": {
                            "$id": "#/properties/struture/items/properties/date_with_fine",
                            "type": "string",
                        },
                        "fine_amnt": {
                            "$id": "#/properties/struture/items/properties/fine_amnt",
                            "type": "number",
                        },
                        "fee_types": {
                            "$id": "#/properties/struture/items/properties/fee_types",
                            "type": "array",
                            "items": {
                                "$id": "#/properties/struture/items/properties/fee_types/items",
                                "type": "object",
                                "required": [
                                    "fee_type_id",
                                    "amount",
                                    "discount_groups"
                                ],
                                "properties": {
                                    "fee_type_id": {
                                        "$id": "#/properties/struture/items/properties/fee_types/items/properties/fee_type_id",
                                        "type": "integer"
                                    },
                                    "amount": {
                                        "$id": "#/properties/struture/items/properties/fee_types/items/properties/amount",
                                        "type": "number",
                                    },
                                    "discount_groups": {
                                        "$id": "#/properties/struture/items/properties/fee_types/items/properties/discount_groups",
                                        "type": "array",
                                        "items": {
                                            "$id": "#/properties/struture/items/properties/fee_types/items/properties/discount_groups/items",
                                            "type": "integer"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    fee_structure_copy_schema = {
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "http://example.com/root.json",
        "type": "array",
        "items": {
            "$id": "#/items",
            "type": "object",
            "required": [
                "struture_id",
                "school_class_ids",
                "students_ids"
            ],
            "properties": {
                "struture_id": {
                    "$id": "#/items/properties/struture_id",
                    "type": "integer"
                },
                "school_class_ids": {
                    "$id": "#/items/properties/school_class_ids",
                    "type": "array",
                    "items": {
                        "$id": "#/items/properties/school_class_ids/items",
                        "type": "integer"
                    }
                },
                "students_ids": {
                    "$id": "#/items/properties/students_ids",
                    "type": "array",
                    "items": {
                        "$id": "#/items/properties/students_ids/items",
                        "type": "integer"
                    }
                }
            }
        }
    }

    fee_type_schema = {
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "http://example.com/root.json",
        "type": "array",
        "items": {
            "$id": "#/items",
            "type": "object",
            "required": [
                "name",
                "description"
            ],
            "properties": {
                "name": {
                    "$id": "#/items/properties/name",
                    "type": "string",
                    "minLength": 0,
                    "maxLength": 100
                },
                "description": {
                    "$id": "#/items/properties/description",
                    "type": "string",
                    "minLength": 0,
                    "maxLength": 200
                }
            }
        }
    }

    bus_stage_fee_post_scheme = {
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "http://example.com/root.json",
        "type": "array",
        "items": {
            "$id": "#/items",
            "type": "object",
            "required": [
                "bus_inf_id",
                "stage_name",
                "one_way_fee",
                "two_way_fee"
            ],
            "properties": {
                "bus_inf_id": {
                    "$id": "#/items/properties/bus_inf_id",
                    "type": "integer"
                },
                "stage_name": {
                    "$id": "#/items/properties/stage_name",
                    "type": "string"
                },
                "one_way_fee": {
                    "$id": "#/items/properties/one_way_fee",
                    "type": "number"
                },
                "two_way_fee": {
                    "$id": "#/items/properties/two_way_fee",
                    "type": "number",
                    "minimum": 1.0
                }
            }
        }
    }

    bus_stage_fee_patch_scheme = {
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "http://example.com/root.json",
        "type": "object",
        "required": [
            "stage_name",
            "one_way_fee",
            "two_way_fee"
        ],
        "properties": {
            "stage_name": {
                "$id": "#/properties/stage_name",
                "type": "string",
                "maxLength": 100
            },
            "one_way_fee": {
                "$id": "#/properties/one_way_fee",
                "type": "number"
            },
            "two_way_fee": {
                "$id": "#/properties/two_way_fee",
                "type": "number",
                "minimum": 1.0
            }
        }
    }

    bus_stage_fee_multiPatch_schema = {
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "http://example.com/root.json",
        "type": "array",
        "items": {
            "$id": "#/items",
            "type": "object",
            "required": [
                "bus_stage_id",
                "stage_name",
                "one_way_fee",
                "two_way_fee"
            ],
            "properties": {
                "bus_stage_id": {
                    "$id": "#/items/properties/bus_stage_id",
                    "type": "integer"
                },
                "stage_name": {
                    "$id": "#/items/properties/stage_name",
                    "type": "string"
                },
                "one_way_fee": {
                    "$id": "#/items/properties/one_way_fee",
                    "type": "number"
                },
                "two_way_fee": {
                    "$id": "#/items/properties/two_way_fee",
                    "type": "number",
                    "minimum": 1.0
                }
            }
        }
    }

    bus_stage_fee_multiDelete_schema = {
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "http://example.com/root.json",
        "type": "array",
        "items": {
            "$id": "#/items",
            "type": "object",
            "required": [
                "bus_stage_id",
                "status"
            ],
            "properties": {
                "bus_stage_id": {
                    "$id": "#/items/properties/bus_stage_id",
                    "type": "array",
                    "items": {
                        "$id": "#/items/properties/bus_stage_id/items",
                        "type": "integer"
                    }
                },
                "status": {
                    "$id": "#/items/properties/status",
                    "type": "string"
                }
            }
        }
    }

    student_fee_copy_schema = {
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "http://example.com/root.json",
        "type": "array",
        "required": [
            "total",
            "payment_mode",
            "payment_details",
            "details"
        ],
        "properties": {
            "total": {
                "$id": "#/properties/total",
                "type": "number"
            },
            "payment_mode": {
                "$id": "#/properties/payment_mode",
                "type": "string",
                "pattern": "^(.*)$"
            },
            "payment_details": {
                "$id": "#/properties/payment_details",
                "type": "string",
                "pattern": "^(.*)$"
            },
            "details": {
                "$id": "#/properties/details",
                "type": "array",
                "items": {
                    "$id": "#/properties/details/items",
                    "type": "object",
                    "required": [
                        "student_fee_id",
                        "amount_pay" 
                    ],
                    "properties": {
                        "student_fee_id": {
                            "$id": "#/properties/details/items/properties/student_fee_id",
                            "type": "integer"
                        },
                        "additional_discount": {
                            "$id": "#/properties/details/items/properties/additional_discount",
                            "type": "number"
                        },
                        "amount_pay": {
                            "$id": "#/properties/details/items/properties/amount_pay",
                            "type": "number"
                        }
                    }
                }
            }
        }
    }


