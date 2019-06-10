from .alpha import *


class FeeTypeServ(MethodView):

    @token_required
    def get(user,self, fee_type_id):
        if user['user_type'] not in (UserType.PRINCIPAL.value, UserType.ADMIN.value, UserType.SUPPORT.value):
            return failureRes('User not authorised'), 403
        
        try:
            query = db.session.query(FeeType).\
                filter(FeeType.status == NewEnum.ACTIVE.value,
                       FeeType.school_id == user['school_id'])
            if fee_type_id is None:
                query = query.all()
                output = self.get_fee_types(query)
            else:
                query = query.filter(FeeType.id == fee_type_id).all()
            output = self.get_fee_types(query)

            return successRes('Data fetched successfully', 'fee_types', output)
        
        except Exception as e:
            print(e)
            return jsonify({'message': 'Error Occured'}), 500


    @token_required
    def post(user, self):
        if user['user_type'] not in (UserType.PRINCIPAL.value, UserType.ADMIN.value, UserType.SUPPORT.value):
            return failureRes('User not authorised'), 403
        
        try:
            datas = json.loads(request.data)
            isError = isValidationError(datas, SchemaValidate.fee_type_schema)
            if not isError:
                for data in datas:
                    c = FeeType()
                    print(data)
                    c.name = data.get('name')
                    c.description = data.get('description')
                    c.school_id = user['school_id']
                    c.status = NewEnum.ACTIVE.value
                    db.session.add(c)
                    
                db.session.commit()
                return successRes('Created')
            else:
                return failureRes(isError), 400

        except Exception as e:
            db.session.rollback()
            print(e)
            return jsonify({'message': 'Error Occured'}), 500

    @token_required
    def patch(user, self, fee_type_id):
        if user['user_type'] not in (UserType.PRINCIPAL.value, UserType.ADMIN.value, UserType.SUPPORT.value):
            return failureRes('User not authorised'), 403
        try:
            s = db.session.query(FeeType).\
                filter(FeeType.status==NewEnum.ACTIVE.value,
                       FeeType.school_id==user['school_id']).\
                filter(FeeType.id == fee_type_id).first()
            data = request.data
            dataDict = json.loads(data)
            s.name = dataDict.get('name')
            s.description = dataDict.get('description')
            db.session.commit()

            return successRes('fee type edited sucessfully')

        except Exception as e:
            db.session.rollback()
            print(e)
            return jsonify({'message': 'Error Occured'}), 500


    @token_required
    def delete(user, self, fee_type_id):
        if user['user_type'] not in (UserType.PRINCIPAL.value, UserType.ADMIN.value, UserType.SUPPORT.value):
            return failureRes('User not authorised'), 403

        try:
            s = db.session.query(FeeType).\
                filter(FeeType.status == NewEnum.ACTIVE.value,
                       FeeType.school_id == user['school_id']).\
                filter(FeeType.id == fee_type_id).first()
            s.status = NewEnum.DEACTIVE.value
            db.session.commit()

            return successRes('fee type deleted sucessfully')

        except Exception as e:
            db.session.rollback()
            print(e)
            return jsonify({'message': 'Error Occured'}), 500


    def get_fee_types(self, query):
        output = []
        for i in query:
            output.append({
                "id": i.id,
                "name": i.name,
                "description": i.description,
            })
        return output


