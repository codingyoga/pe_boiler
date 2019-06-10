from enum import Enum

class NewEnum(Enum):

    ACTIVE      =   'A'
    DEACTIVE    =   'D'
    TEMPDEACTIV =   'T'
    READ        =   'R'
    NEW         =   'N'
    PUBLISHED   =   'P'
    UNPUBLISHED =   'U'
    ARCHIVED    =   'AR'
    INPROGRESS  =   'I'
    COMPLETED   =   'C'
    FAILED      =   'F'
    

class GenEnum(Enum):

    ACTIVE                  =   'Active'
    INACTIVE                =   'Inactive'
    DEACTIVATED             =   'Deactivated'
    PUBLISHED               =   'Published'
    UNPUBLISHED             =   'UnPublished'
    SCHOOLDEACTIVATED       =   'SchoolDeactivated'
    ARCHIVED                =   'Archived'
    INPROGRESS              =   'InProgress'
    COMPLETED               =   'Completed'
    FAILED                  =   'Failed'
    TEMP_DEACTIVATED        =   'TempDeactivated'
    SUCCESS                 =   'Success'
    TAMPERED                =   'Tampered'
    SUCCESS_UPDATE_FAILED   =   'Success Update Failed'
    PAID                    =   'Paid'
    DUE                     =   'Due'


class UserType(Enum):
    GUARDIAN          = "Guardian"
    EMPLOYEE          = "Employee"
    SUPPORT           = "Support"
    CORPORATEMANAGER  = "CorporateManager"
    TEACHER          = "Teacher"
    PRINCIPAL        = "Principal"
    ADMIN            = "SchoolAdministrator"
    COORDINATOR      = "Coordinator"
    MANAGER          = "Manager"
    NONTEACHINGSTAFF = "NonTeachingStaff"
    SUPPORTINGSTAFF  = "SupportingStaff"


class PaymentEnum(Enum):
    CASH = "Cash"
    CHEQUE = "Cheque"
    DD = "DD"
