from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound
from flask_weasyprint import HTML, render_pdf ,CSS
from datetime import date
from util.num import int_to_en

today = date.today()

partialload = Blueprint('partialload', __name__,
                        template_folder='partial_load')

from parenteye import token_required, db
from red.master import *


@partialload.route('/', defaults={'page': 'index'})
def show(page):
    try: 
        return "HI"
    except TemplateNotFound: 
        abort(404)

@partialload.route('/reciept/<reciept_id>')
@token_required
def reciept(user, reciept_id):
    result = db.session.query(OfflinePaymentDetails.transaction_id,Student.name, Student.admn_no, SchoolClass.name,
    FeePayment.amount,DetailPayment.amount,DetailPayment.additional_discount,
                              FeeType.name, School.name, School.school_first_row_info, School.school_logo_url, School.school_second_row_info, StudentFee.due_amount, FeeTermGroup.name
    ).join(
        FeePayment, OfflinePaymentDetails.transaction_id == FeePayment.transaction_id
    ).join(
        DetailPayment,FeePayment.payment_id == DetailPayment.payment_id
    ).join(
        StudentFee,DetailPayment.student_fee == StudentFee.id
    ).join(
        Student,StudentFee.student_id == Student.id
    ).join(
        FeeTermDetails,StudentFee.fee_term_details_id == FeeTermDetails.id
    ).join(
        FeeTermGroup, FeeTermDetails.fee_term_group_id == FeeTermGroup.id
    ).join(
        FeeType,FeeTermDetails.fee_type_id == FeeType.id
    ).join(
        SchoolClass,Student.school_class_id == SchoolClass.id
    ).join(
        School, SchoolClass.school_id == School.id
    ).filter(
        FeePayment.receipt_sequence== reciept_id
    )
    result.all()
    slno=1
    net_amount=0
    context = {
        "name": result[0][1] if result[0][1] != None else "",
        "class": result[0][3] if result[0][3] != None else "",
        "date": today.strftime("%d/%m/%Y"),
        "admissionNo": result[0][2] if result[0][2] != None else "",
        "fees": [],
        "schoolFirstRowInfo": result[0][9] if result[0][9] != None else "",
        "schoolName": result[0][8] if result[0][8] != None else "",
        "logoUrl": result[0][10] if result[0][10] != None else "",
        "recipetNumber": reciept_id,
        "total_in_words": int_to_en(int(result[0][4])),
        "total": result[0][4] if result[0][4] != None else "",
        "net":0,
        "schoolSecondRowInfo": result[0][11] if result[0][11] != None else ""

    }
    for res in result:
        context['fees'].append(
            {   
                "Slno":slno,
                "fee_name": res[7] if res[7] != None else "",
                "Discount": res[6] if res[6] !=None else "",
                "Amount": res[5] if res[5] != None else "",
                "Paid": res[4] if res[4] != None else "",
                "term_name": res[13] if res[13] != None else "",
                "Due": int(res[12])+int(res[5])+(int(res[6]) if res[6] != None else 0)
               

            }
 
        )
        net_amount+= int(res[12])+int(res[5]) +(int(res[6]) if res[6] != None else 0)
        slno+=1
    context['net'] = net_amount
 










    template_f = "partial_load/payment_reciept/" + \
        str(user["school_id"])+".html"

    html = render_template(template_f, **context)
    # html = render_template('hello.html', name=name)
    return render_pdf(HTML(string=html))
