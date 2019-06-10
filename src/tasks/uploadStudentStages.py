from .alpha import *

def upload_student_stage(file_name, school_id, email):    
    file_location = cwd+'/'+application.config.get('UPLOAD_FOLDER') +'/'+ file_name
    with open(file_location, 'r') as csvFile:
        reader = csv.DictReader(csvFile)
        student_id_list = []
        error_rows = []


        for row in reader:
            student_id_list.append(row['student_id'])

        # get all students
        students_obj = db.session.query(Student).\
            join(SchoolClass, (SchoolClass.id == Student.school_class_id) & (SchoolClass.school_id == school_id)).\
            filter(Student.id.in_(student_id_list)).\
            filter(SchoolClass.status == GenEnum.ACTIVE.value,
                   Student.status == GenEnum.ACTIVE.value).all()


        # get all bus and stages
        buses = db.session.query(BusStageFee.id, BusStageFee.stage_name, BusInf.bus_name).\
            join(BusInf, BusInf.id == BusStageFee.bus_inf_id).\
            filter(BusInf.status == GenEnum.ACTIVE.value,BusInf.school_id == school_id).\
            filter(BusStageFee.status == NewEnum.ACTIVE.value).order_by(BusStageFee.bus_inf_id).all()
        
        bus_array = {}
        
        for bus in buses:
            try:
                values = bus_array[bus[2].lower()]
            except KeyError:
                bus_array[bus[2].lower()] = {}
            bus_array[bus[2].lower()].update({bus[1].lower(): bus[0]})


    csvFile.close()


    with open(file_location, 'r') as csvFile:
        reader = csv.DictReader(csvFile)
        for row in reader:
            try:
                s_id = int(row['student_id'])
            except ValueError:
                row.update(
                    {"validation_error": "Student id not given"})
                error_rows.append(row)
                continue
            for student in students_obj:
                if student.id == s_id:
                    print(student.name)
                    status_code = 0
                    if row['return_in_same_bus'] in ('y','Y'):
                        row['dropping_bus'] = row['boarding_bus']
                        row['dropping_stage'] = row['boarding_stage']
                    if row['boarding_bus'] and row['boarding_stage']:
                        status_code = 3
                        try:
                            student.boarding_stage_id = bus_array[row['boarding_bus'].lower()
                                                                  ][row['boarding_stage'].lower()]
                            print('Entry updated')

                        except KeyError:
                            row.update(
                                {"validation_error": "Boarding stage not found"})
                            status_code = 2
                    if row['dropping_bus'] and row['dropping_stage']:
                        try:
                            student.dropping_stage_id = bus_array[row['dropping_bus'].lower()
                                                                  ][row['dropping_stage'].lower()]
                            status_code = 3 if status_code != 2 else 2
                            print('Exit updated')
                        except KeyError:
                            if status_code == 2:
                                row['validation_error'] = 'Boarding and Dropping stage not found'
                            else:
                                row.update(
                                    {"validation_error": "Dropping stage not found"})
                            status_code = 2


                    if status_code == 0:
                        row.update(
                            {"validation_error": "Boarding/Droping bus has no stages"})
                        error_rows.append(row)
                    elif status_code == 2:
                        error_rows.append(row)


        
        db.session.commit()
    csvFile.close()

    if error_rows:
        err_file_location = cwd+'/' + \
            application.config.get('UPLOAD_FOLDER') + '/error.csv'

        with open(err_file_location, 'w', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=error_rows[0].keys())

            writer.writeheader()
            writer.writerows(error_rows)

        csvfile.close()
    # recipientsList = ['noufal@scientiaindia.com']
    msg = Message('Hey There', recipients=[email])
    if error_rows:
        msg.html = '''<b>There is some error found in uploaded data</b>
        <br/><br/>Don't worry we just attached this mail please currect it and retry'''
        with application.open_resource(err_file_location) as cat:
            msg.attach('error_file.csv', 'text/csv', cat.read())
    else:
        msg.html = '''<b>The data uploaded successfully. </b>
        <br/><br/> Thank you for not making any errors'''
    mail.send(msg)


    return 'Done'
