
const app = new Vue({
    el: '#transportation',
    delimiters: ["<%", "%>"],
    components: {
        Multiselect: window.VueMultiselect.default
    },
    data: {
        //listing 
        classList: [],
        studentStageList: [],
        studentStageListCopy: [],
        stageNames: [],
        disable: true,
        selectedClassStudents: [],
        selectedClassStudentsCopy: [],
        studentStageEdited: [],
        classListIndex: "",
        //listing
        editSucces: false,
        bus_key: -1,
        isDisabled: true,
        bus_list: [],
        newAddedNames: [],
        single_bus_details: [],
        patchData: true,
        sendData: true,
        added_stage: [],
        bus_copy_list: [],
        bus_edited_list: [],
        isReturnBus: true,
        stageIdEntry: '',
        stageIdExit: '',
        list_bus: [],
        multiselectStudentValue1: [],
        multiselectStudentOptions1: [{}],
        list_students: [],

        page: {
            main: true,
            create_transportation: false
        },
        statusModalData: {
            showModal: false,
            responsetype: '',
            responsemsg: '',
        },
        validateErrorMessage: '',
        twoBtnModalData: {
            show2BtnModal: false,
            responsetype: modalType.warning,
            responsemsg: 'Are you sure want to delete this.',
            methodToRun: 0,
            params: [],
            proceedClicked: false
        }

    },
    methods: {
        allowNumbersOnly(e) {
            var code = (e.which) ? e.which : e.keyCode;
            if (code > 31 && (code < 48 || code > 57)) {
                e.preventDefault();
            }
        },
        handleProceedClicked() {
            this.twoBtnModalData.proceedClicked = true
            if (this.twoBtnModalData.methodToRun == 1) {
                this.removeRoute(...this.twoBtnModalData.params)
            }
            if (this.twoBtnModalData.methodToRun == 2) {
                this.cancelEdit(...this.twoBtnModalData.params)
            }
            if (this.twoBtnModalData.methodToRun == 3) {
                this.cancelStudentStageEdit()
            }

        },
        editStage(busId, key) {
            if (this.bus_key == -1) {
                this.bus_key = key
                for (const buslistObj in this.bus_list) {
                    let busobj = this.bus_list[buslistObj]
                    if (busId == busobj.bus_inf_id) {
                        this.single_bus_details = JSON.parse(JSON.stringify(busobj));

                    }
                }
                this.bus_list[key].isHidden ? this.bus_list[key].isHidden = false : this.bus_list[key].isHidden = true
                this.bus_copy_list = JSON.parse(JSON.stringify(this.bus_list));
            }
            else {
                this.statusModalData = {
                    responsetype: modalType.warning,
                    responsemsg: "Cancel or Save previous Stage to edit this Stage",
                    showModal: true
                }
            }
        },
        cancelEdit(key) {
            if (!this.twoBtnModalData.show2BtnModal) {
                this.twoBtnModalData.responsemsg = "Are you sure you want to cancel the changes "
                this.twoBtnModalData.params = [key]
                this.twoBtnModalData.show2BtnModal = true
                this.twoBtnModalData.methodToRun = 2
                this.twoBtnModalData.proceedClicked = false
            }
            if (this.twoBtnModalData.proceedClicked) {
                this.bus_key = -1
                this.bus_list = JSON.parse(JSON.stringify(this.bus_copy_list));
                this.bus_list[key].isHidden ? this.bus_list[key].isHidden = false : this.bus_list[key].isHidden = true
                this.added_stage = []
                this.bus_edited_list = []
            }
        },
        saveBusRoute(busId, bkey) {
            let stageChanged = false
            let addStage = true
            let editStage = true
            this.sendData = true
            this.patchData = true
            this.newAddedNames = []
            for (const busOrstagesKey in this.bus_list[bkey].stages) {
                // stageSize = this.bus_list[bkey].stages.length
                // stageSize2 = stageSize - 1
                if (this.bus_list[bkey].stages[busOrstagesKey].stage_id == -1) {
                    //stageChanged = true
                    // editStage = false
                    let duplicate = false
                    this.newAddedNames.push(this.bus_list[bkey].stages[busOrstagesKey].stage_name)
                    for (var i = 0; i < this.newAddedNames.length; i++) {
                        for (var j = 0; j < this.newAddedNames.length; j++) {
                            if (i != j) {
                                if (this.newAddedNames[i] == this.newAddedNames[j]) {
                                    duplicate = true
                                }
                            }
                        }
                    }
                    for (const stg in this.single_bus_details.stages) {
                        for (const names in this.newAddedNames) {
                            if (this.single_bus_details.stages[stg].stage_name == this.newAddedNames[names]) {
                                this.sendData = false
                                addStage = false
                                stageChanged = true
                                editStage = false
                                validateErrorMessage = "Stage Name already Exists"
                            }
                           
                        }
                    }
                    if (duplicate == true) {
                        this.sendData = false
                        addStage = false
                        stageChanged = true
                        editStage = false
                        validateErrorMessage = "Same Stage Names Entered"
                    }
                }
            }
            for (const busOrstagesKey in this.bus_copy_list[bkey].stages) {
                if (editStage == true) {
                    if (this.bus_list[bkey].stages[busOrstagesKey].stage_name != this.bus_copy_list[bkey].stages[busOrstagesKey].stage_name) {
                        let duplicate2 = false
                        this.newAddedNames.push(this.bus_list[bkey].stages[busOrstagesKey].stage_name)
                        for (var i = 0; i < this.newAddedNames.length; i++) {
                            for (var j = 0; j < this.newAddedNames.length; j++) {
                                if (i != j) {
                                    if (this.newAddedNames[i] == this.newAddedNames[j]) {
                                        duplicate2 = true
                                    }
                                }
                            }
                        }
                        for (const stg in this.single_bus_details.stages) {
                            for (const names in this.newAddedNames) {
                                if (this.single_bus_details.stages[stg].stage_name == this.newAddedNames[names]) {
                                    this.sendData = false
                                    addStage = false
                                    this.patchData = false
                                    editStage = false
                                    validateErrorMessage = "Stage Name already Exists"
                                }
                               
                            }
                        }
                        if (duplicate2 == true) {
                            this.sendData = false
                            addStage = false
                            this.patchData = false
                            editStage = false
                            validateErrorMessage = "Same Stage Names Entered"
                        }
                    }
                    
                }
            }
            for (const busOrstagesKey in this.bus_list[bkey].stages) {
                if (this.bus_list[bkey].stages[busOrstagesKey].two_way_fee == '') {
                    this.sendData = false
                    addStage = false
                    this.patchData = false
                    validateErrorMessage = "Please Enter the Two way fee"
                }
                if (this.bus_list[bkey].stages[busOrstagesKey].one_way_fee == '') {
                    this.sendData = false
                    addStage = false
                    this.patchData = false
                    validateErrorMessage = "Please Enter the One way fee"
                }
                
                if (this.bus_list[bkey].stages[busOrstagesKey].stage_name == '') {
                    this.sendData = false
                    addStage = false
                    this.patchData = false
                    validateErrorMessage = "Please Enter the Stage Name"
                }
                if (addStage == true) {
                    if (this.bus_list[bkey].stages[busOrstagesKey].stage_id == -1) {
                        this.added_stage.push(this.bus_list[bkey].stages[busOrstagesKey])
                    }
                }
                if (this.sendData == false) {
                    this.statusModalData = {
                        responsetype: modalType.error,
                        responsemsg: validateErrorMessage,
                        showModal: true
                    }
                }
            }
            

            if (editStage == true) {
                for (const busCopystagesKey in this.bus_copy_list[bkey].stages) {
                    if (this.bus_list[bkey].stages[busCopystagesKey].stage_name != this.bus_copy_list[bkey].stages[busCopystagesKey].stage_name) {
                        stageChanged = true
                    }
                    if (this.bus_list[bkey].stages[busCopystagesKey].one_way_fee != this.bus_copy_list[bkey].stages[busCopystagesKey].one_way_fee) {
                        stageChanged = true
                    }
                    if (this.bus_list[bkey].stages[busCopystagesKey].two_way_fee != this.bus_copy_list[bkey].stages[busCopystagesKey].two_way_fee) {
                        stageChanged = true
                    }

                    if (stageChanged) {
                        let stageId = this.bus_list[bkey].stages[busCopystagesKey].stage_id
                        let stagename = this.bus_list[bkey].stages[busCopystagesKey].stage_name
                        let one_way_fee = this.bus_list[bkey].stages[busCopystagesKey].one_way_fee
                        let two_way_fee = this.bus_list[bkey].stages[busCopystagesKey].two_way_fee
                        this.bus_edited_list.push({
                            bus_stage_id: stageId,
                            one_way_fee: one_way_fee,
                            stage_name: stagename,
                            two_way_fee: two_way_fee

                        })
                        stageChanged = false

                    }
                }
            }
            if (this.added_stage.length > 0) {
                this.postBusStage(busId, bkey)
            }
            if (this.bus_edited_list.length > 0 && this.added_stage.length == 0) {
                this.patchBusStage(bkey)
            }
            if (this.bus_edited_list.length < 1 && this.added_stage.length < 1 && editStage==true) {
                this.statusModalData = {
                    responsetype: modalType.error,
                    responsemsg: "Please Make Any Changes",
                    showModal: true
                }
            }
           

        },
        postBusStage(busId, key) {

            for (const buskey in this.added_stage) {
                let postAdd = this.added_stage[buskey]
                delete postAdd.stage_id
                postAdd.bus_inf_id = busId

            }


            if (this.sendData == true) {
                console.log("addeddata", JSON.stringify(this.added_stage))
                let self = this
                apiUrl = '/api/bus_stage_fee/'
                methodType = APIMethod.POST
                dataBody = JSON.stringify(this.added_stage)
                data = commonApiCall(apiUrl, methodType, dataBody)
                data.then(function (json) {


                    editSucces = true
                    self.bus_list[key].isHidden ? self.bus_list[key].isHidden = false : self.bus_list[key].isHidden = true
                    self.getBusList()
                    self.added_stage = []
                    self.bus_key = -1
                    if (self.bus_edited_list.length > 0) {
                    self.patchBusStage(key)
                     }
                     self.bus_edited_list=[]

                });
            }
        },
        patchBusStage(key) {

            if (this.patchData == false) {
                this.statusModalData = {
                    responsetype: modalType.error,
                    responsemsg: validateErrorMessage,
                    showModal: true
                }
            }

            else if (this.patchData == true) {
                console.log("editdata", JSON.stringify(this.bus_edited_list))
                let self = this
                apiUrl = '/api/bus_stage_fee/'
                methodType = APIMethod.PATCH
                dataBody = JSON.stringify(this.bus_edited_list)
                data = commonApiCall(apiUrl, methodType, dataBody)
                data.then(function (json) {
                    editSucces = true
                    self.bus_list[key].isHidden ? self.bus_list[key].isHidden = false : self.bus_list[key].isHidden = true
                    self.getBusList()
                    self.bus_edited_list = []
                    self.bus_key = -1

                });
            }
        },

        removeRoute(id, rkey, bkey) {
            let deleteAdded = false
            if (this.bus_list[bkey].stages[rkey].stage_id == -1) {
                this.bus_list[bkey].stages.splice(rkey, 1)
                //this.bus_list[bkey].isHidden ? this.bus_list[bkey].isHidden = false : this.bus_list[bkey].isHidden = true
                deleteAdded = true
                // this.bus_key = -1

            }

            if (deleteAdded == false) {
                if (!this.twoBtnModalData.show2BtnModal) {
                    this.twoBtnModalData.responsemsg = "Are you sure you want to delete this Bus Stage"
                    this.twoBtnModalData.params = [id, rkey, bkey]
                    this.twoBtnModalData.show2BtnModal = true
                    this.twoBtnModalData.methodToRun = 1
                    this.twoBtnModalData.proceedClicked = false
                }
                if (this.twoBtnModalData.proceedClicked) {
                    let self = this
                    apiUrl = '/api/bus_stage_fee/' + id
                    methodType = APIMethod.DELETE
                    dataBody = null
                    data = commonApiCall(apiUrl, methodType, dataBody)
                    data.then(function (json) {
                        //  self.bus_key = -1    
                        self.bus_list[bkey].stages.splice(rkey, 1)
                        self.bus_copy_list[bkey].stages.splice(rkey, 1)
                      //  self.bus_copy_list = JSON.parse(JSON.stringify(self.bus_list));
                        // self.bus_list[bkey].isHidden ? self.bus_list[bkey].isHidden = false : self.bus_list[bkey].isHidden = true

                    })


                }
                }
        },
        addroute(tkey) {

            this.bus_list[tkey].stages.push(
                {
                    one_way_fee: "",
                    stage_id: -1,
                    two_way_fee: "",
                    stage_name: ""
                })

        },
        editStudentStage() {
            if (this.disable == true) {
                this.disable = false
                this.studentStageListCopy = JSON.parse(JSON.stringify(this.studentStageList));
                this.selectedClassStudentsCopy = JSON.parse(JSON.stringify(this.selectedClassStudents));
            }
            else {
                this.disable = true

            }
        },
        cancelStudentStageEdit() {
            if (!this.twoBtnModalData.show2BtnModal) {
                this.twoBtnModalData.responsemsg = "Are you sure you want to cancel the changes "
                this.twoBtnModalData.show2BtnModal = true
                this.twoBtnModalData.methodToRun = 3
                this.twoBtnModalData.proceedClicked = false
            }
            if (this.twoBtnModalData.proceedClicked) {
                this.studentStageList = JSON.parse(JSON.stringify(this.studentStageListCopy));
                this.selectedClassStudents = JSON.parse(JSON.stringify(this.selectedClassStudentsCopy));
                this.disable = true

            }
        },
        getStageName() {
            this.stageNames = []
            let self = this
            apiUrl = '/api/bus_stage_fee/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {

                console.log(json.data.bus_Stage_fee)
                //self.bus_list = json
                self.stageNames.push(
                    {
                        id: null,
                        name: null,
                        bus_id: null,
                        bus_name: null
                    }
                )
                for (const buslistkey1 in json.data.bus_Stage_fee) {
                    let bus_id = json.data.bus_Stage_fee[buslistkey1].bus_inf_id
                    let bus_name = json.data.bus_Stage_fee[buslistkey1].bus_name
                    let buslistObj1 = json.data.bus_Stage_fee[buslistkey1]
                    for (const stageskey1 in buslistObj1.stages) {

                        let stagesObj1 = buslistObj1.stages[stageskey1]
                        //for storing stage Names
                        self.stageNames.push(
                            {
                                id: stagesObj1.stage_id,
                                name: stagesObj1.stage_name,
                                bus_id: bus_id,
                                bus_name: bus_name
                            }
                        )

                    }
                }

            });
        },



        getBusList() {
            this.bus_list = []
            let self = this
            apiUrl = '/api/bus_stage_fee/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {

                console.log(json.data.bus_Stage_fee)
                //self.bus_list = json
                if (json.data.bus_Stage_fee.length == 0) {
                    self.statusModalData = {
                        responsetype: modalType.error,
                        responsemsg: "No Data",
                        showModal: true
                    }
                }
                for (const buslistkey in json.data.bus_Stage_fee) {
                    let buslistObj = json.data.bus_Stage_fee[buslistkey]
                    self.bus_list.push({
                        bus_inf_id: buslistObj.bus_inf_id,
                        bus_name: buslistObj.bus_name,
                        bus_reg_no: buslistObj.bus_reg_no,
                        bus_root: buslistObj.bus_root,
                        mobile_no: buslistObj.mobile_no,
                        isHidden: true,
                        stages: []
                    })


                    for (const stageskey in buslistObj.stages) {

                        let stagesObj = buslistObj.stages[stageskey]
                        //for storing stage Names
                        self.stageNames.push(
                            {
                                id: stagesObj.stage_id,
                                name: stagesObj.stage_name
                            }
                        )
                        //for storing stage Names
                        if (buslistObj.stages.length == 0) {
                            self.bus_list[buslistkey].stages.push({
                                stage_id: -1,
                                one_way_fee: stagesObj.one_way_fee,
                                stage_name: stagesObj.stage_name,
                                two_way_fee: stagesObj.two_way_fee,

                            })
                        }
                        else {
                            self.bus_list[buslistkey].stages.push({
                                stage_id: stagesObj.stage_id,
                                one_way_fee: stagesObj.one_way_fee,
                                stage_name: stagesObj.stage_name,
                                two_way_fee: stagesObj.two_way_fee,

                            })
                        }

                    }
                }

            });
        },
        listBus() {
            let self = this
            apiUrl = '/api/bus_stage_fee/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                self.list_bus = json.data.bus_Stage_fee;
            });
        },
        //listing bus assigned   
        selectedclass(e) {
            this.classListIndex = e.target.selectedOptions[0].index - 1
            for (const studentIndex in this.studentStageList) {
                let classObj = this.studentStageList[studentIndex]
                if (e.target.selectedOptions[0].id == classObj.id) {
                    this.selectedClassStudents = this.studentStageList[studentIndex]
                }
            }

        },
        saveEditedStudentBusStage() {
            let stageChanged = false
            let busEntryId = ""
            let busExitId = ""
            for (const stageChangedKey in this.studentStageList[this.classListIndex].students) {
                if (this.studentStageList[this.classListIndex].students[stageChangedKey].boarding_stage_id != this.studentStageListCopy[this.classListIndex].students[stageChangedKey].boarding_stage_id) {
                    stageChanged = true
                }

                if (this.studentStageList[this.classListIndex].students[stageChangedKey].dropping_stage_id != this.studentStageListCopy[this.classListIndex].students[stageChangedKey].dropping_stage_id) {
                    stageChanged = true
                }
                busEntryId = this.studentStageList[this.classListIndex].students[stageChangedKey].boarding_stage_id
                busExitId = this.studentStageList[this.classListIndex].students[stageChangedKey].dropping_stage_id
                if (this.studentStageList[this.classListIndex].students[stageChangedKey].boarding_stage_id == "") {
                    busEntryId = null

                }
                if (this.studentStageList[this.classListIndex].students[stageChangedKey].dropping_stage_id == "") {
                    busExitId = null
                }

                if (stageChanged) {
                    this.studentStageEdited.push({
                        student_ids: this.studentStageList[this.classListIndex].students[stageChangedKey].student_id,
                        bus_route_entry_id: busEntryId,
                        bus_route_exit_id: busExitId
                    })
                    stageChanged = false

                }

            }
            if (this.studentStageEdited.length > 0) {
                let self = this
                console.log("edit", self.studentStageEdited)
                apiUrl = '/api/student_bus_stage/'
                methodType = APIMethod.PATCH
                dataBody = JSON.stringify(this.studentStageEdited)
                data = commonApiCall(apiUrl, methodType, dataBody)
                data.then(function (json) {
                    console.log(self.studentStageEdited)
                    editSucces = true
                    self.disable ? disable = false : self.disable = true
                    self.getBusAssignedStudents()
                    self.studentStageEdited = []

                });
            }
            else if (stageChanged == false) {
                this.statusModalData = {
                    responsetype: modalType.error,
                    responsemsg: "No Changes to Save",
                    showModal: true
                }
            }

        },
        selectedBoarding(e, studentId, std) {

            busnameAndStage = e.target.value.split('--')
            if (e.target.selectedOptions[0].id == 0) {
                this.studentStageList[this.classListIndex].students[std].boarding_stage_id = null
                this.selectedClassStudents.students[std].boarding_stage_id = null
            }
            else {
                this.studentStageList[this.classListIndex].students[std].boarding_stage_id = e.target.selectedOptions[0].id
                this.studentStageList[this.classListIndex].students[std].boarding_stage_name = busnameAndStage[0]
                this.selectedClassStudents.students[std].boarding_stage_id = e.target.selectedOptions[0].id
                this.selectedClassStudents.students[std].boarding_stage_name = busnameAndStage[0]
            }
            // this.selectedClassStudents.students[std].boarding_bus_name = busnameAndStage[1]
            // this.studentStageList[this.classListIndex].students[std].boarding_bus_name = busnameAndStage[1]

        },
        selectedDropping(e, studentId, std) {
            busnameAndStage2 = e.target.value.split('--')
            if (e.target.selectedOptions[0].id == 0) {
                this.studentStageList[this.classListIndex].students[std].dropping_stage_id = null
                this.selectedClassStudents.students[std].dropping_stage_id = null
            }
            else {
                this.studentStageList[this.classListIndex].students[std].dropping_stage_id = e.target.selectedOptions[0].id
                this.studentStageList[this.classListIndex].students[std].dropping_stage_name = busnameAndStage2[0]
                this.selectedClassStudents.students[std].dropping_stage_id = e.target.selectedOptions[0].id
                this.selectedClassStudents.students[std].dropping_stage_name = busnameAndStage2[0]
            }
            // this.selectedClassStudents.students[std].dropping_bus_name = busnameAndStage2[1]
            // this.studentStageList[this.classListIndex].students[std].dropping_bus_name = busnameAndStage2[1]
        },
        getBusAssignedStudents() {
            this.classList = []
            let self = this
            apiUrl = '/api/student_bus_stage/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {

                for (const classKey in json.data.school_class_stages) {
                    self.classList.push(
                        {
                            id: json.data.school_class_stages[classKey].id,
                            name: json.data.school_class_stages[classKey].name
                        }
                    )
                }
                self.studentStageList = json.data.school_class_stages

                if (self.classListIndex !== "") {
                    for (const studentIndex in self.studentStageList) {
                        let classObj = self.studentStageList[studentIndex]
                        let classIndex = self.classListIndex + 1
                        if (classIndex == classObj.id) {
                            self.selectedClassStudents = self.studentStageList[studentIndex]
                        }
                    }
                }

            });
        },
        changePage(val) {
            this.listStudents()
            this.listBus()
            if (val === 'create_struture') {
                this.getFeeTypes()
            }
            if (val === 'create_transportation') {
                this.bus_key = -1
                this.getBusList()
            }
            if (val === 'assign_stage') {
                this.multiselectStudentValue1 = []
                this.multiselectStudentOptions1 = []
                this.getBusAssignedStudents()
                this.getStageName()
                this.selectedClassStudents = []
                this.classListIndex = ""
                this.disable = true
            }
            for (var key in this.page) {
                this.page[key] = false
            }
            this.page[val] = true
        },
        multiselectStudentCustomLabel(option) {
            return `${option.busStageStudent}`
        },
        listStudents() {
            let self = this
            apiUrl = '/api/student/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {

                // alert(JSON.stringify(json.data.students))
                self.list_students = json.data.students;
                for (const schoolClass in self.list_students) {
                    studentArray = []
                    for (const studentObj in json.data.students[schoolClass]) {
                        const student = json.data.students[schoolClass][studentObj];
                        studentArray.push(
                            { busStageStudent: student.name, busStageStudentId: student.id }
                        )
                    }
                    self.multiselectStudentOptions1.push({ className: schoolClass, busStageStudentList: studentArray });
                }
            });
        },
        stage1(el) {
            console.log(el.target.selectedOptions[0].id);
            this.stageIdEntry = el.target.selectedOptions[0].id
        },
        stage2(el) {
            console.log(el.target.selectedOptions[0].id);
            this.stageIdExit = el.target.selectedOptions[0].id

        },
        saveBusStage() {
            console.log(this.multiselectStudentValue1);
            busStageStudentArray = [];
            studentId = -1;
            for (const key in this.multiselectStudentValue1) {
                const element = this.multiselectStudentValue1[key];
                // alert(element.feeDiscountStudentId);
                studentId = element.busStageStudentId;
                busStageStudentArray.push(studentId);
                // alert(JSON.stringify(studentArray))
            }
            if (this.stageIdExit == '' && this.isReturnBus)
                this.stageIdExit = this.stageIdEntry;
            if (this.isReturnBus)  
                this.stageIdExit ='';  
            if ((!busStageStudentArray.length > 0)){
                this.statusModalData = {
                    responsetype: modalType.error,
                    responsemsg: "Please select Students",
                    showModal: true
                }
            }
            else if (this.stageIdEntry == '' && this.stageIdExit == ""){
                this.statusModalData = {
                    responsetype: modalType.error,
                    responsemsg: "Please select bus stage",
                    showModal: true
                }
            }
            else{
            send = [
                {

                    "boarding_stage_id": this.stageIdEntry,
                    "dropping_stage_id": this.stageIdExit,
                    "student_ids": busStageStudentArray

                }
            ]
            let assign = true

                if (this.stageIdExit == '' && !this.isReturnBus) {
                validateErrorMessage = "Select Exit Stage"
                assign = false
            }
            if (this.stageIdEntry == '') {
                validateErrorMessage = "Select Entry Stage"
                assign = false
            }
            if (busStageStudentArray.length < 1) {
                validateErrorMessage = "Select Students to Assign"
                assign = false
            }
            if (this.isReturnBus == false && this.stageIdExit == this.stageIdEntry) {
                validateErrorMessage = "Select Exit Stage"
                assign = false
            }
            if (assign == true) {
                let self = this
                apiUrl = '/api/student/'
                methodType = APIMethod.PATCH
                dataBody = JSON.stringify(send)
                data = commonApiCall(apiUrl, methodType, dataBody)
                data.then(function (json) {
                    self.multiselectStudentValue1 = [],
                        self.getBusAssignedStudents()
                    self.getStageName()

                });
                self.stageIdExit = ''
            }
            else {
                this.statusModalData = {
                    responsetype: modalType.error,
                    responsemsg: validateErrorMessage,
                    showModal: true
                }
            }
        }
    },


    created() {

    }
}})