from enum import Enum

from flask_babel import _
from flask_babel import lazy_gettext as _l


class MsgEnum(Enum):
    VALIDATION_ERROR = _l('Validation error occured')
    NOT_AUTHORISED = _l('User not authorised')
    EXCEPTION_OCCURED = _l('Exception occured')
    ALLREADY_PAID = _l('Some students allready paid the fees')
    DATA_SUCCESS = _l('Data fetched successfully')
    FEE_DEL_DIS = _l("Fee allready collected, Delete Disabled")
    DATA_INCOMPLETE = _l("Given data is incomplete")
