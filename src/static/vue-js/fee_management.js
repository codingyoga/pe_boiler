//For DatePicker

Vue.component('demo-grid', {
    delimiters: ["<%", "%>"],

    template: '#grid-template',

    props: {
        studentfeelist: '',
        columns: '',
        filterKey: String,



    },

    data: function () {
        var sortOrders = {}
        this.columns.forEach(function (key) {
            sortOrders[key] = 1
        })
        return {
            sortKey: '',
            sortOrders: sortOrders,
            startRow: 0,
            rowsPerPage: 2,
        }
    },
    mounted: function () {
        this.$forceUpdate();
    },
    computed: {
        filteredStudentsForFeeList: function () {
            var sortKey = this.sortKey
            console.log("sortedkey=" + sortKey)
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            console.log("filterKey=" + filterKey)
            var order = this.sortOrders[sortKey] || 1
            console.log("order=" + order)
            var studentfeelist = this.studentfeelist
            console.log("studentfeelist=" + studentfeelist)
            if (filterKey) {
                studentfeelist = studentfeelist.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                studentfeelist = studentfeelist.slice().sort(function (a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return studentfeelist
        },


    },



    methods: {
        sortBy(key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1

        },
        changePage2(val) {
            app.paymentDetails = ""
            app.getStudentIndividualFeeDetails(val)
            app.changePage('stdudentIndividualFeeList')
        },
        movePages(amount) {
            // alert("hi")
            var newStartRow = this.startRow + (amount * this.rowsPerPage);
            if (newStartRow >= 0 && newStartRow < this.filteredItems.length) {
                this.startRow = newStartRow;
            }
        }
    },

}),
    // For Focus the element
    // Vue.directive("focus", {
    //     inserted: function (el) {
    //         // Focus the element
    //         el.focus()
    //     },
    //     update: function (el, binding) {
    //         var value = binding.value;
    //         if (value) {
    //             Vue.nextTick(function () {
    //                 el.focus();
    //             });
    //         }
    //     }
    // })
    // For Focus the element
    Vue.component('datepicker', {
        template: '<input id="datepicker" ref="date" onkeydown="return false" :value="value" @input="updateDate()"/>',
        props: ['date-format', 'value'],
        data: function () {
            return {
                startDate: ''
            }
        },

        mounted: function () {
            var context = this;
            $(this.$el).datepicker({
                // format: "yyyy-mm-dd",
                format: "dd-mm-yyyy",
                autoclose: true
            }).on('changeDate', function (e) {
                context.$emit('input', e.currentTarget.value);
            });

        },
        beforeDestroy: function () {
            $(this.$el).datepicker('hide').datepicker('destroy');
        }
    })

// modal component
// register modal component
Vue.component('modal', {
    delimiters: ["<%", "%>"],
    template: '#modal-template',
    props: ['responsetype', 'responsemsg', 'data'],
}),
    Vue.component('delete-modal', {
        delimiters: ["<%", "%>"],
        template: '#delete-modal-template',
        props: ['responsetype', 'responsemsg', 'data'],
    })


const app = new Vue({
    el: '#fee_management',

    delimiters: ["<%", "%>"],



    // components: { multiselect: window.VueBootstrapMultiselect },
    components: {
        Multiselect: window.VueMultiselect.default
    },

    data: {

        validationErrMsg: '',
        paymentmethod: 'Cash',
        paymentDetails: '',
        classId:'',
        classListDropDown:'',
        isClassId:false,
        structureName: '',
        isSaveStruct: false,
        postDataCreateStructure: '',
        hide_alert: false,
        hide_alert_class:false,
        showFeeTypeModal: false,
        createStructure: [{
            name: '',
            starting_date: '',
            due_date: '',
            date_with_fine: '',
            fine_amnt: 0,
            fee_types: [{
                fee_type_id: 0,
                fee_type_name: "Select fee name",
                amount: 0,
                discount_groups: []
            }],

        }],
        createStructureList: [],
        feeTypeCollected: false,
        createStructureTab: {
            createStructure: true,
            editStructure: false
        },
        currentlyEditingStruct: -1,
        currentlyEditingStructKey: -1,
        feeGroupDelId: [],
        feeTypeDelId: [],
        structBackup: [],
        newStructBackup: [],
        editedStruct: [],

        details: [],
        details1: [],
        concession_group_values: [],
        concession_group_option: [],
        save_feelist: [],

        //Data for assign structure
        fee_structure_resp: [],
        fee_structure_names: [],
        classList: [],
        selectedItems: [],
        selectedStructure: '',
        selectedStructureDetail: [],
        selectedItemsNum: 0,
        selectedAssignIndex: 0,
        focusedStudentGroup: 0,
        searchStudentAssign: '',
        student: [],
        selectedStudent: 0,
        selectAllClicked: {},
        selectedStudentIds: [],
        postAssignStructData: [],
        selectedStudentClass: [],
        // 

        createDiscount: [],
        listDiscount: [],
        fee_discount_group: [],
        list_students: [],
        //this is added by jithin on 17-04-2019 for multi-select start here

        multiselectStudentValue: [],
        multiselectStudentOptions: [{}],
        multiselectStudentValue1: [
            []
        ],
        // multiselectStudentOptions1: [{}],

        //Stores the id of focused panel
        groupFocus: 0,

        type_selection: 'Class wise',

        fee_categories: [],
        searchQuery: '',
        gridDataCount: 1,
        gridDataCountNonStructured: 1,
        list_students_fee: [],
        list_students_fee_individual: [],
        gridColumns: ['Slno', 'StudentName', 'Class', 'FatherName', 'ContactNumber', 'BookNumber', 'AdmissionNumber', 'NetPayable', 'Due', 'Paid'],
        gridData: [],
        gridColumnsForNonstructured: ['Slno', 'StudentName', 'Class', 'AdmissionNumber', 'Due', 'Paid'],
        gridDataForNonstructured: [],
        individualStudentFee: [{
            FeeName: 'Feee',
            AmountPaid: '300',
            Due: '10',
            AppliedDiscount: '4000',
            Discount: '',
            Pay: '1001',
            OriginalPay: '1001',
            ToPay: true
        },
        {
            FeeName: 'Feee',
            AmountPaid: '200',
            Due: '100',
            AppliedDiscount: '10',
            Discount: '',
            Pay: '100',
            OriginalPay: '100',
            ToPay: true
        },
        {
            FeeName: 'Feee',
            AmountPaid: '200',
            Due: '100',
            AppliedDiscount: '1000',
            Discount: '',
            Pay: '100',
            OriginalPay: '100',
            ToPay: true
        },
        {
            FeeName: 'Feee',
            AmountPaid: '100',
            Due: '100',
            AppliedDiscount: '100',
            Discount: '',
            Pay: '100',
            OriginalPay: '100',
            ToPay: true
        },
        {
            FeeName: 'Feee',
            AmountPaid: '50',
            Due: '10',
            AppliedDiscount: '100',
            Discount: '',
            Pay: '100',
            OriginalPay: '100',
            ToPay: true
        }
        ],



        page: {
            main: true,
            create_struture: false,
            assign_struture: false,
            student_fee: false,
            concession_category: false,
            transportation_route_fee: false
        },
        //fee term
        bus_key: -1,
        saveButtonEnable: true,
        selectedMonth: [],
        copyArrayFeeTerms: [],
        feeTermeditData: {},
        feeTermPatchDAta:[],
        feeTermPostData: [],
        validateErrorMessage: [],
        month_name2: [],
        month_name: [{
            name: "January",
            id: 1,
            disabled: true,
            selected: false,
            selectedBy: ''
        },
        {
            name: "February",
            id: 2,
            disabled: true,
            selected: false,
            selectedBy: ''
        },
        {
            name: "March",
            id: 3,
            disabled: true,
            selected: false,
            selectedBy: ''
        },
        {
            name: "April",
            id: 4,
            disabled: true,
            selected: false,
            selectedBy: ''
        },
        {
            name: "May",
            id: 5,
            disabled: true,
            selected: false,
            selectedBy: ''
        },
        {
            name: "June",
            id: 6,
            disabled: true,
            selected: false,
            selectedBy: ''
        },
        {
            name: "July",
            id: 7,
            disabled: true,
            selected: false,
            selectedBy: ''
        },
        {
            name: "August",
            id: 8,
            disabled: true,
            selected: false,
            selectedBy: ''
        },
        {
            name: "September",
            id: 9,
            disabled: true,
            selected: false,
            selectedBy: ''
        },
        {
            name: "October",
            id: 10,
            disabled: true,
            selected: false,
            selectedBy: ''
        },
        {
            name: "November",
            id: 11,
            disabled: true,
            selected: false,
            selectedBy: ''
        },
        {
            name: "December",
            id: 12,
            disabled: true,
            selected: false,
            selectedBy: ''
        },
        ],
        // payment_method_radio:[
        //     {"checked":}
        // ],


        get_fee_term_list: [],
        create_fee_term: [{
            term_name: "",
            start_date: "",
            end_date: "",
            terms_details: []
        }],
        //fee term
        //For status modal
        statusModalData: {
            showModal: false,
            responsetype: '',
            responsemsg: '',
        },

        //For status modal
        statusModalData1: {
            showModal: false,
            responsetype: modalType.warning,
            responsemsg: 'Are you sure want to delete this.',
        },
        twoBtnModalData: {
            show2BtnModal: false,
            responsetype: modalType.warning,
            responsemsg: 'Are you sure want to delete this.',
            methodToRun: 0,
            params: [],
            proceedClicked: false
        }


    },

    computed: {
        filteredStudents() {
            
            //For student search in assign structure 
            var context = this;
            if (this.searchStudentAssign !== '' && this.focusedStudentGroup !== 0) {
                return this.student[this.focusedStudentGroup].filter((item) => {
                    return item.name.toLowerCase().startsWith(this.searchStudentAssign.toLowerCase());
                })
            } else {
                return this.student[this.focusedStudentGroup];
            }
        },
        busTermMonth() {
            tmpMonth = this.month_name
            for (var i = 0; i < this.selectedMonth.length; i++) {
                for (var j = 0; j < tmpMonth.length; j++) {
                    if (tmpMonth[j].id == this.selectedMonth[i].id) {


                        tmpMonth[j].selected = true

                    }

                }


            }
            return tmpMonth
        },

        totalAmount() {
            var output = 0
            for (const fee in this.list_students_fee_individual.terms) {
                for (i = 0; i < this.list_students_fee_individual.terms[fee].fees.length; i++) {
                    if (this.list_students_fee_individual.terms[fee].fees[i].ToPay) {
                        if (!this.list_students_fee_individual.terms[fee].fees[i].due_amount == '')
                            output += parseInt(this.list_students_fee_individual.terms[fee].fees[i].due_amount)
                    }
                }
            }
            return output
        },
    },

    mounted() {
        console.log("Vue2 Mounted")
    },

    methods: {
        submit(){
        },
        handleProceedClicked() {
            this.twoBtnModalData.proceedClicked = true
            if (this.twoBtnModalData.methodToRun == 0) {
                // alert("Test")
            }
            if (this.twoBtnModalData.methodToRun == 1) {
                this.deleteFeeDiscount(...this.twoBtnModalData.params)
            }
            if (this.twoBtnModalData.methodToRun == 2) {
                this.addCollection()
            }
            if (this.twoBtnModalData.methodToRun == 3) {
                this.handleStructEditDelete(this.twoBtnModalData.params[0])
            }
            if (this.twoBtnModalData.methodToRun == 4) {
                this.editStructTypeDel(...this.twoBtnModalData.params)
            }
            if (this.twoBtnModalData.methodToRun == 5) {
                this.editStructGroupDel(...this.twoBtnModalData.params)
            }
            if (this.twoBtnModalData.methodToRun == 6) {
                this.deleteAddedFeeTerm(...this.twoBtnModalData.params)
            }
            if (this.twoBtnModalData.methodToRun == 7) {
                this.removeFeeTerm(...this.twoBtnModalData.params)
            }
            if (this.twoBtnModalData.methodToRun == 8) {
                this.cancelEdit(...this.twoBtnModalData.params)
            }
        },


        //fee term
        getStudentDetails() {
            let self = this
            apiUrl = '/api/student/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                let showAlert = true
                let studentClassKeys = Object.keys(json.data.students)
                for (const classKey in studentClassKeys) {
                    let classItem = studentClassKeys[classKey]
                    for (const stdDetailsKey in json.data.students[classItem]) {
                        if (json.data.students[classItem][stdDetailsKey].entryStage != null || json.data.students[classItem][stdDetailsKey].exitStage != null) {
                            showAlert = false
                        }
                    }
                }
                if (showAlert == true) {
                    self.saveButtonEnable = false
                    self.statusModalData = {
                        responsetype: modalType.warning,
                        responsemsg: "No Entry Stage Added for students",
                        showModal: true
                    }
                } else {
                    self.saveButtonEnable = true
                }
            });
        },
        //editing bus fee term list
        saveEdit(id, tkey) {
            let feeEdit = this.get_fee_term_list[tkey]
            delete feeEdit.isHidden
            let self = this
            let startDate = feeEdit.start_date
            let endDate = feeEdit.end_date
               convDateRev(startDate)
               convDateRev(endDate)
               this.feeTermPatchDAta={
                   end_date: convDateRev(endDate),
                   id: feeEdit.id,
                   start_date: convDateRev(startDate),
                   term_name: feeEdit.term_name,
                   terms_details: feeEdit.terms_details
               }
               let proceedSave=true
               if(this.feeTermPatchDAta.terms_details.length == 0){
                proceedSave=false
                
                   this.statusModalData = {
                       responsetype: modalType.warning,
                       responsemsg: "Discount Cannot be Greater than 100%",
                       showModal: true
                   }
                   this.cancelEdit2(tkey)
                   //this.get_fee_term_list[tkey].isHidden ? this.get_fee_term_list[tkey].isHidden = false : this.get_fee_term_list[tkey].isHidden = true
               }
               
            if (this.feeTermPatchDAta.term_name == '') {
                proceedSave = false

                this.statusModalData = {
                    responsetype: modalType.warning,
                    responsemsg: "Term Name Cannot be Empty",
                    showModal: true
                }
                this.get_fee_term_list[tkey].isHidden ? this.get_fee_term_list[tkey].isHidden = false : this.get_fee_term_list[tkey].isHidden = true
               
            }
        //     for (const edobj in this.feeTermPatchDAta.terms_details) {
                
        //         if ((this.feeTermPatchDAta.terms_details[edobj].is_percentage) && (this.feeTermPatchDAta.terms_details[edobj].discount > 100 || this.feeTermPatchDAta.terms_details[edobj].discount == 0)) {
        //         proceedSave = false

        //         this.statusModalData = {
        //             responsetype: modalType.warning,
        //             responsemsg: "Discount Cannot be Greater than 100%",
        //             showModal: true
        //         }
        //         this.cancelEdit2(tkey)
        //         //this.get_fee_term_list[tkey].isHidden ? this.get_fee_term_list[tkey].isHidden = false : this.get_fee_term_list[tkey].isHidden = true
        //     }
        // }
               if(proceedSave==true){
            console.log("second", JSON.stringify(this.feeTermPatchDAta))
            apiUrl = '/api/bus_term_fee/' + id
            methodType = APIMethod.PATCH
            dataBody = JSON.stringify(this.feeTermPatchDAta)
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                self.feeTermPatchDAta=[]
                self.$forceUpdate();
                self.getFeeTerms()
                self.bus_key = -1
            });
        }
        },
        cancelEdit2(tkey){
            this.bus_key = -1
            this.get_fee_term_list[tkey].isHidden ? this.get_fee_term_list[tkey].isHidden = false : this.get_fee_term_list[tkey].isHidden = true
            this.get_fee_term_list = JSON.parse(JSON.stringify(this.copyArrayFeeTerms));
        },
        cancelEdit(tkey) {
            if (!this.twoBtnModalData.show2BtnModal) {
                this.twoBtnModalData.responsemsg = "Are you sure you want to cancel the changes"
                this.twoBtnModalData.show2BtnModal = true
                this.twoBtnModalData.params = [tkey]
                this.twoBtnModalData.methodToRun = 8
                this.twoBtnModalData.proceedClicked = false
            }
            if (this.twoBtnModalData.proceedClicked) {
                this.bus_key = -1
            this.get_fee_term_list[tkey].isHidden ? this.get_fee_term_list[tkey].isHidden = false : this.get_fee_term_list[tkey].isHidden = true
            this.get_fee_term_list = JSON.parse(JSON.stringify(this.copyArrayFeeTerms));
            // if (this.get_fee_term_list[tkey].isHidden == false) {
            //     this.get_fee_term_list[tkey].isHidden = true
            // }
            // else {
            //     this.get_fee_term_list[tkey].isHidden = false
            // }
            }

        },
        editFeeTerm(tkey) {
            if (this.bus_key == -1) {
                this.bus_key = tkey
            this.copyArrayFeeTerms = JSON.parse(JSON.stringify(this.get_fee_term_list));
            this.get_fee_term_list[tkey].isHidden ? this.get_fee_term_list[tkey].isHidden = false : this.get_fee_term_list[tkey].isHidden = true
            // if (this.get_fee_term_list[tkey].isHidden == false) {
            //     this.get_fee_term_list[tkey].isHidden = true
            // }
            // else {
            //     this.get_fee_term_list[tkey].isHidden = false
            // }
            }
            else {
                this.statusModalData = {
                    responsetype: modalType.warning,
                    responsemsg: "Cancel or Save previous Term to edit this Term",
                    showModal: true
                }
            }
        },
        clearOnSave() {
            this.create_fee_term = [{
                term_name: "",
                start_date: "",
                end_date: "",
                terms_details: []
            }],
                this.feeTermeditData = {}
            // this.selectedMonth=[]
            this.month_name2 = []
            this.month_name = [{
                name: "January",
                id: 1,
                disabled: true,
                selected: false,
                selectedBy: ''
            },
            {
                name: "February",
                id: 2,
                disabled: true,
                selected: false,
                selectedBy: ''
            },
            {
                name: "March",
                id: 3,
                disabled: true,
                selected: false,
                selectedBy: ''
            },
            {
                name: "April",
                id: 4,
                disabled: true,
                selected: false,
                selectedBy: ''
            },
            {
                name: "May",
                id: 5,
                disabled: true,
                selected: false,
                selectedBy: ''
            },
            {
                name: "June",
                id: 6,
                disabled: true,
                selected: false,
                selectedBy: ''
            },
            {
                name: "July",
                id: 7,
                disabled: true,
                selected: false,
                selectedBy: ''
            },
            {
                name: "August",
                id: 8,
                disabled: true,
                selected: false,
                selectedBy: ''
            },
            {
                name: "September",
                id: 9,
                disabled: true,
                selected: false,
                selectedBy: ''
            },
            {
                name: "October",
                id: 10,
                disabled: true,
                selected: false,
                selectedBy: ''
            },
            {
                name: "November",
                id: 11,
                disabled: true,
                selected: false,
                selectedBy: ''
            },
            {
                name: "December",
                id: 12,
                disabled: true,
                selected: false,
                selectedBy: ''
            },
            ]

        },

        remainingMonth() {

            let self = this;
            for (var i = 0; i < self.get_fee_term_list.length; i++) {
                for (var j = 0; j < self.month_name2.length; j++) {
                    for (var k = 0; k < self.get_fee_term_list[i].terms_details.length; k++) {
                        if (self.month_name2[j].id == self.get_fee_term_list[i].terms_details[k].term_month) {

                            this.selectedMonth.push(self.month_name2[j])

                            self.month_name2.splice(j, 1)


                        }
                    }
                }
            }
        },

        getFeeTerms() {
            let self = this
            apiUrl = '/api/bus_term_fee/'
            methodType = APIMethod.GET
            dataBody = null
            this.get_fee_term_list = []
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                for (const busTermFeeKey in json.data.bus_term_fee) {
                    let busTermObj = json.data.bus_term_fee[busTermFeeKey]
                    let start_date = busTermObj.start_date
                    let end_date = busTermObj.end_date
                    convDateRev(start_date)
                    convDateRev(end_date)
                    self.get_fee_term_list.push({
                        end_date: convDateRev(end_date),
                        collected: busTermObj.collected,
                        id: busTermObj.id,
                        isHidden: false,
                        start_date: convDateRev(start_date),
                        term_name: busTermObj.term_name,
                        terms_details: []
                    })
                    
                    for (const termDetailsKey in busTermObj.terms_details) {
                        let termDetailsObj = busTermObj.terms_details[termDetailsKey]

                        self.get_fee_term_list[busTermFeeKey].terms_details.push({
                            discount: termDetailsObj.discount,
                            is_percentage: termDetailsObj.is_percentage,
                            term_month: termDetailsObj.term_month
                        })

                    }

                }

                self.remainingMonth()
            });

        },

        saveBusFeeTerm() {
            this.feeTermPostData = []
            for (const key in this.create_fee_term) {
                let start_date = this.create_fee_term[key].start_date
                let end_date = this.create_fee_term[key].end_date
                convDateRev(start_date)
                convDateRev(end_date)
                this.feeTermPostData.push({
                    term_name: this.create_fee_term[key].term_name,
                    start_date: convDateRev(start_date),
                    end_date: convDateRev(end_date),
                    terms_details: this.create_fee_term[key].terms_details
                })
            }
            // for validation
            let saveData = true
            for (const editKey in this.feeTermPostData) {
                if (this.feeTermPostData[editKey].terms_details.length == 0) {
                    saveData = false
                    validateErrorMessage = "Please select a Month"
                }
                if (this.feeTermPostData[editKey].end_date == '') {
                    saveData = false
                    validateErrorMessage = "Please select an Ending Date"
                }
                if (this.feeTermPostData[editKey].start_date == '') {
                    saveData = false
                    validateErrorMessage = "Please select a Starting Date"
                }
                
                if (this.feeTermPostData[editKey].term_name == '') {
                    saveData = false
                    validateErrorMessage = "Please Enter the Term name"
                }
               if (Date.parse(this.feeTermPostData[editKey].start_date) > Date.parse(this.feeTermPostData[editKey].end_date)) {
                    saveData = false
                   validateErrorMessage = "Start Date Cannot be Greater than End Date"
                }
                for (const termobj in this.feeTermPostData[editKey].terms_details) {
                    if ((this.feeTermPostData[editKey].terms_details[termobj].is_percentage == true) && (this.feeTermPostData[editKey].terms_details[termobj].discount > 100 || this.feeTermPostData[editKey].terms_details[termobj].discount == 0)){
                        saveData = false
                        validateErrorMessage = "Discount Cannot be Greater than 100%"
                    }
                    if (this.feeTermPostData[editKey].terms_details[termobj].discount < 0) {
                        saveData = false
                        validateErrorMessage = "Discount Cannot be a Negative Value"
                    }
              }
             }
            if (saveData == false) {
                this.statusModalData = {
                    responsetype: modalType.error,
                    responsemsg: validateErrorMessage,
                    showModal: true
                }
            } else if (saveData == true) {
                console.log("post",JSON.stringify(this.feeTermPostData))
                let self = this
                apiUrl = '/api/bus_term_fee/'
                methodType = APIMethod.POST
                dataBody = JSON.stringify(this.feeTermPostData)
                data = commonApiCall(apiUrl, methodType, dataBody)
                data.then(function (json) {
                    self.$forceUpdate();
                    self.clearOnSave()
                    self.getFeeTerms()
                    self.feeTermPostData = []
                    //For showing response popup
                    self.statusModalData = {
                        responsetype: modalType.success,
                        responsemsg: modalMsg.saveSuccess,
                        showModal: true
                    }

                });


            }
        },
        percentageEditCheckBox(e, tkey, mkey) {
            let index = 0;
            for (var j = 0; j < this.get_fee_term_list[tkey].terms_details.length; j++) {
                if (e.target.id == this.get_fee_term_list[tkey].terms_details[j].term_month) {
                    index = j
                }

            }

            this.get_fee_term_list[tkey].terms_details[index].is_percentage = e.target.checked
        },

        percentageCheckBox(e, tkey, mkey) {
            let index = 0;
            for (var j = 0; j < this.create_fee_term[tkey].terms_details.length; j++) {
                if (e.target.id == this.create_fee_term[tkey].terms_details[j].term_month) {
                    index = j
                }

            }

            this.create_fee_term[tkey].terms_details[index].is_percentage = e.target.checked

        },
        deleteAddedFeeTerm(tkey) {
            if (!this.twoBtnModalData.show2BtnModal) {
                this.twoBtnModalData.responsemsg = "Are you sure you want to delete this Fee Term"
                this.twoBtnModalData.params = [tkey]
                this.twoBtnModalData.show2BtnModal = true
                this.twoBtnModalData.methodToRun = 6
                this.twoBtnModalData.proceedClicked = false
            }
            if (this.twoBtnModalData.proceedClicked) {
                this.create_fee_term.splice(tkey, 1)
            }

        },
        removeFeeTerm(id, tkey) {
            if (this.bus_key == -1) {
             //  this.bus_key = tkey
            if (!this.twoBtnModalData.show2BtnModal) {
                this.twoBtnModalData.responsemsg = "Are you sure you want to delete this Fee Term"
                this.twoBtnModalData.params = [id,tkey]
                this.twoBtnModalData.show2BtnModal = true
                this.twoBtnModalData.methodToRun = 7
                this.twoBtnModalData.proceedClicked = false
            }
           
            if (this.twoBtnModalData.proceedClicked) {
                for (var i = 0; i < this.get_fee_term_list[tkey].terms_details.length; i++) {
                    for (var J = 0; J < this.month_name.length; J++) {

                        if (this.get_fee_term_list[tkey].terms_details[i].term_month == this.month_name[J].id) {
                            this.month_name[J].selected = false
                        }
                    }
                }
                for (const feelistKey in this.get_fee_term_list[tkey].terms_details) {
                    let feeMonth = this.get_fee_term_list[tkey].terms_details[feelistKey]

                    for (var i = 0; i < this.selectedMonth.length; i++) {
                        if (this.selectedMonth[i].id == feeMonth.term_month) {
                            this.selectedMonth.splice(i, 1)
                        }
                    }
                    //     for (const termKey in cont.get_fee_term_list[feelistKey].terms_details) {
                    //         for(var i=0;i<cont.selectedMonth.length;i++){
                    //             if (cont.selectedMonth[i].id == cont.get_fee_term_list[feelistKey].terms_details[termKey].term_month){
                    //                 index3 = i
                    //             }
                    //         }

                    //    }
                }
                let index3 = 0
                let cont = this
                let self = this
                apiUrl = '/api/bus_term_fee/' + id
                methodType = APIMethod.DELETE
                dataBody = null
                data = commonApiCall(apiUrl, methodType, dataBody)
                data.then(function (json) {

                    self.get_fee_term_list.splice(tkey, 1)

                    //     for (const feelistKey in self.get_fee_term_list[tkey].terms_details) {
                    //         let feeMonth = self.get_fee_term_list[tkey].terms_details[feelistKey]
                    //         console.log("hai",feeMonth)
                    //         for (var i = 0; i < self.selectedMonth.length; i++) {
                    //             if (self.selectedMonth[i].id == feeMonth.term_month){
                    //                 self.selectedMonth.splice(i, 1)
                    //             }
                    //         }
                    // //     for (const termKey in cont.get_fee_term_list[feelistKey].terms_details) {
                    // //         for(var i=0;i<cont.selectedMonth.length;i++){
                    // //             if (cont.selectedMonth[i].id == cont.get_fee_term_list[feelistKey].terms_details[termKey].term_month){
                    // //                 index3 = i
                    // //             }
                    // //         }

                    // //    }
                    // }


                });
            }
            }
            else {
                this.statusModalData = {
                    responsetype: modalType.warning,
                    responsemsg: "Cancel or Save previous Term to edit this Term",
                    showModal: true
                }
            }
            
        },
        selectFeeMonth(e, termkey, monthkey) {
            if (e.target.checked == true) {
                for (var j = 0; j < this.month_name.length; j++) {
                    if (e.target.id == this.month_name[j].id) {
                        this.month_name[j].selectedBy = termkey
                        this.$forceUpdate();
                    }
                }
                //
                this.selectedMonth.push({
                    disabled: false,
                    id: e.target.id,
                    name: "",
                    selectedBy: termkey,
                    selected: true,


                })
                //
                this.month_name[monthkey].disabled = false
                this.month_name[monthkey].selected = true

                this.create_fee_term[termkey].terms_details.push({
                    term_month: e.target.id,
                    discount: 0,
                    is_percentage: false,
                })
            } else {
                for (var j = 0; j < this.month_name.length; j++) {
                    if (e.target.id == this.month_name[j].id) {
                        this.month_name[j].selectedBy = ''
                        this.$forceUpdate();
                    }

                }

                let index = 0;
                for (var j = 0; j < this.create_fee_term[termkey].terms_details.length; j++) {
                    if (e.target.id == this.create_fee_term[termkey].terms_details[j].term_month) {
                        index = j
                    }

                }
                let index2 = 0;
                for (var j = 0; j < this.selectedMonth.length; j++) {
                    if (e.target.id == this.selectedMonth[j].id) {
                        index2 = j
                    }

                }
                this.selectedMonth.splice(index2, 1)
                this.create_fee_term[termkey].terms_details.splice(index, 1)
                this.month_name[monthkey].selected = false
                this.month_name[monthkey].disabled = true
                this.selectedMonth[monthkey].disabled = true


            }


        },
        selectFeeMonthEdit(e, termkey, monthkey) {

            if (e.target.checked == true) {

                for (var j = 0; j < this.month_name.length; j++) {
                    if (e.target.id == this.month_name[j].id) {
                        this.month_name[j].selectedBy = ""
                        this.$forceUpdate();
                    }

                }
                this.get_fee_term_list[termkey].terms_details.push({
                    term_month: e.target.id,
                    discount: 0,
                    is_percentage: false,
                })
                //
                this.selectedMonth.push({
                    disabled: false,
                    id: e.target.id,
                    name: "",
                    selectedBy: "",
                    selected: true,


                })
                //
                this.month_name[monthkey].disabled = false
                this.month_name[monthkey].selected = true


            } else {
                console.log("id", e.target.id)
                console.log("id", e)
                for (var j = 0; j < this.month_name.length; j++) {
                    if (e.target.id == this.month_name[j].id) {
                        this.month_name[j].selectedBy = ''
                        this.$forceUpdate();
                    }

                }

                let index = 0;
                for (var j = 0; j < this.get_fee_term_list[termkey].terms_details.length; j++) {
                    if (e.target.id == this.get_fee_term_list[termkey].terms_details[j].term_month) {
                        index = j
                    }

                }
                let index2 = 0;
                for (var j = 0; j < this.selectedMonth.length; j++) {
                    if (e.target.id == this.selectedMonth[j].id) {
                        index2 = j
                    }

                }
                this.selectedMonth.splice(index2, 1)
                this.get_fee_term_list[termkey].terms_details.splice(index, 1)
                this.month_name[monthkey].selected = false
                this.month_name[monthkey].disabled = true
            }
        },
        getEditDiscount(e, tkey) {
            let index = 0;
            for (var j = 0; j < this.get_fee_term_list[tkey].terms_details.length; j++) {
                if (e.target.id == this.get_fee_term_list[tkey].terms_details[j].term_month) {
                    index = j
                }

            }

            this.get_fee_term_list[tkey].terms_details[index].discount = Number(e.target.value)
        },


        getDiscount(e, termkey) {
            let index = 0;
            for (var j = 0; j < this.create_fee_term[termkey].terms_details.length; j++) {
                if (e.target.id == this.create_fee_term[termkey].terms_details[j].term_month) {
                    index = j
                }

            }

            this.create_fee_term[termkey].terms_details[index].discount = Number(e.target.value)
        },

        addFeeTerm() {
            this.create_fee_term.push({
                term_name: "",
                start_date: "",
                end_date: "",
                terms_details: []
            })
            // let ind = this.create_fee_term.length -1
            // setFocus(ind)

        },


        // fee term

        //this is added by jithin on 17-04-2019 for multi-select start here
        multiselectStudentCustomLabel(option) {
            return `${option.feeDiscountStudent}`
        },
        //this is added by jithin on 17-04-2019 for multi-select end here

        //For getting fee types in Create Structure
        getFeeTypes() {

            let self = this
            apiUrl = '/api/fee_type/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                self.fee_categories = json.data.fee_types
            });
        },

        //for getting school classes in 'Assign Structure'
        getSchoolClasses() {
            let self = this
            apiUrl = '/api/school_class/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                self.classList = []
                let schoolClassResp = json.data.classes
                for (const sClass in schoolClassResp) {
                    let classObj = schoolClassResp[sClass]
                    self.classList.push({
                        id: classObj.id,
                        isActive: false,
                        name: classObj.name
                    })
                }
                console.log(json.data.classes)
            })

        },

        postNewFeeType() {

        },

        //For getting discount groups in Create Structure
        getDiscountGroup() {
            this.fee_discount_group = []
            let self = this
            apiUrl = '/api/fee_discount/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                for (const key in json.data.fee_discounts) {
                    const element = json.data.fee_discounts[key];
                    self.fee_discount_group.push({
                        id: element.id,
                        name: element.name
                    })
                    if(self.fee_discount_group.length == 0){
                        toast.triggerToast('alert-warning', 'No Fee Discount Groups Added')
                    }
                }
                console.log(self.fee_discount_group);
            });
        },

        //For getting fee structures in "Assign Structure" and "Edit Structure"
        getFeeStructure() {
            this.fee_structure_resp = ""
            let self = this
            apiUrl = '/api/fee_struture/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                // self.fee_discount_group = json.data.fee_discounts
                self.fee_structure_resp = json.data

                // temporarily placed
                self.genFeeStructList()
                self.editStructureList()
            });
        },

        //Method for assign fee structure
        selectAllStudents(e) {
            console.log(e.target.checked)
            let context = this
            let className = e.target.value
            if (e.target.checked == true) {
                for (i = 0; i < this.student[className].length; i++) {
                    if (this.student[className][i].isActive == false) {
                        Vue.set(this.student[className][i], 'isActive', true)
                        this.selectedStudent += 1
                    }
                }
            } else if (e.target.checked == false) {
                for (i = 0; i < this.student[className].length; i++) {
                    if (this.student[className][i].isActive == true) {
                        Vue.set(this.student[className][i], 'isActive', false)
                        if (this.selectedStudent != 0) {
                            this.selectedStudent -= 1
                        }
                    }
                }
            }

        },
        clearAssignStructure() {
            this.fee_structure_names = []
            this.classList = []
            this.selectedItems = []
            this.student = []
            this.selectedStructure = ''
            this.selectedStructureDetail = []
            this.selectedItemsNum = 0
            this.selectedAssignIndex = 0
            this.focusedStudentGroup = 0
            this.searchStudentAssign = ''
            this.selectedStudent = 0
            this.selectedStudentIds = []
            this.postAssignStructData = []
            this.type_selection = "Class wise"
            this.getStudentsList()
            this.getFeeStructure()
            this.getSchoolClasses()
        },
        copyAssignStructure() {
            console.log(JSON.stringify(this.postAssignStructData))
            let self = this
            apiUrl = '/api/fee_struture/'
            methodType = APIMethod.OPTIONS
            dataBody = JSON.stringify(this.postAssignStructData)
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                console.log(json.message)
                self.statusModalData = {
                    responsetype: modalType.error,
                    responsemsg: json.message,
                    showModal: true
                }
                self.clearAssignStructure()
            });
        },

        //Methods for create fee structure
        getStudentsList() {
            let self = this
            apiUrl = '/api/student/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                console.log(json)
                self.student = json.data.students;
                for (let [key, value] of Object.entries(self.student)) {
                    for (var i = 0; i < value.length; i++) {
                        value[i] = {
                            id: value[i].id,
                            name: value[i].name,
                            isActive: false
                        }
                        console.log(value[i].id);
                        console.log(value[i].name);
                    }
                    console.log(value);
                }
            });
        },

        changeFeeStructPage(val) {
            this.createStructureTab = {
                createStructure: false,
                editStructure: false
            }
            if (val == 'editStructure') {
                this.getFeeStructure()
            }
            this.createStructureTab[val] = true
        },

        patchFeeStructure(data) {
            if (this.currentlyEditingStruct != -1) {
                let self = this
                apiUrl = '/api/fee_struture/' + this.currentlyEditingStruct
                methodType = APIMethod.PATCH
                dataBody = JSON.stringify(data)
                data = commonApiCall(apiUrl, methodType, dataBody)
                data.then(function (json) {
                    if(json.message != undefined){
                        self.currentlyEditingStruct = -1
                        self.currentlyEditingStructKey = -1
                        self.getFeeStructure
                    }
                });
            }
        },

        handleStructEdit(structureId, structEditKey) {
            this.feeTypeCollected = false
            let context = this
            if (this.currentlyEditingStruct == -1){
                this.currentlyEditingStruct = structureId
                this.currentlyEditingStructKey = structEditKey
                this.createStructureList[structEditKey].structure.forEach(struct => {
                    struct.fee_types.forEach(feeType => {
                        console.log(feeType.collected)
                        if (feeType.collected){
                            context.feeTypeCollected = true;
                        }
                    });
                });
            }
            else
                this.statusModalData = {
                    responsetype: modalType.warning,
                    responsemsg: "Cancel or Save previous edit to edit this structure.",
                    showModal: true
                }
            this.structBackup = JSON.parse(JSON.stringify(this.createStructureList))
            this.newStructBackup = JSON.parse(JSON.stringify(this.createStructureList))
            console.log("editClicked" + structureId)
        },

        handleStructEditCancel() {
            this.createStructureList = JSON.parse(JSON.stringify(this.newStructBackup))
            this.structBackup = []
            this.currentlyEditingStruct = -1
            this.currentlyEditingStructKey = -1
            this.feeTypeDelId = []
            this.feeGroupDelId = []
        },

        editStructTypeDel(feeTypeId, structureKey, groupKey, feeTypeKey) {
            let self = this
            if(feeTypeId != null){
                if (!this.twoBtnModalData.show2BtnModal) {
                    this.feeTypeDelId = []
                    this.feeTypeDelId.push(feeTypeId)

                    this.twoBtnModalData.responsemsg = "Are you sure you want to delete this Fee Type."
                    this.twoBtnModalData.params = [feeTypeId, structureKey, groupKey, feeTypeKey]
                    this.twoBtnModalData.show2BtnModal = true
                    this.twoBtnModalData.methodToRun = 4
                    this.twoBtnModalData.proceedClicked = false
                } if (this.twoBtnModalData.proceedClicked) {
                    apiUrl = '/api/fee_struture/'
                    methodType = APIMethod.DELETE
                    dataBody = JSON.stringify([{ "fee_term_ids": self.feeTypeDelId }])
                    data = commonApiCall(apiUrl, methodType, dataBody)
                    data.then(function (json) {
                        if (json.message != undefined) {
                            self.createStructureList[structureKey].structure[groupKey].fee_types.splice(feeTypeKey, 1)
                            self.structBackup[structureKey].structure[groupKey].fee_types.splice(feeTypeKey, 1)
                            self.newStructBackup[structureKey].structure[groupKey].fee_types.splice(feeTypeKey, 1)
                        }
                        self.feeTypeDelId = []
                    });
                }
            } else {
                this.createStructureList[structureKey].structure[groupKey].fee_types.splice(feeTypeKey, 1)
                this.structBackup[structureKey].structure[groupKey].fee_types.splice(feeTypeKey, 1)
                this.newStructBackup[structureKey].structure[groupKey].fee_types.splice(feeTypeKey, 1)
            }
        },

        editStructGroupDel(feeGroupId, structureKey, groupKey) {
            let self = this
            if (!this.twoBtnModalData.show2BtnModal) {
                this.feeGroupDelId = []
                this.feeGroupDelId.push(feeGroupId)

                this.twoBtnModalData.responsemsg = "Are you sure you want to delete this Fee Group."
                this.twoBtnModalData.params = [feeGroupId, structureKey, groupKey]
                this.twoBtnModalData.show2BtnModal = true
                this.twoBtnModalData.methodToRun = 5
                this.twoBtnModalData.proceedClicked = false
            } if (this.twoBtnModalData.proceedClicked) {
                apiUrl = '/api/fee_struture/'
                methodType = APIMethod.DELETE
                dataBody = JSON.stringify([{ "fee_group_ids": self.feeGroupDelId }])
                data = commonApiCall(apiUrl, methodType, dataBody)
                data.then(function (json) {
                    if (json.message != undefined){
                        self.createStructureList[structureKey].structure.splice(groupKey, 1)
                        self.newStructBackup[structureKey].structure.splice(feeTypeKey, 1)
                    }
                    self.feeGroupDelId = []
                });
            }
        },

        handleStructEditDelete(structureId) {
            if (!this.twoBtnModalData.show2BtnModal) {
                this.twoBtnModalData.params = [structureId]
                this.twoBtnModalData.show2BtnModal = true
                this.twoBtnModalData.methodToRun = 3
                this.twoBtnModalData.proceedClicked = false
            }
            if (this.twoBtnModalData.proceedClicked) {
                let self = this
                apiUrl = '/api/fee_struture/' + structureId
                methodType = APIMethod.DELETE
                dataBody = null
                data = commonApiCall(apiUrl, methodType, dataBody)
                data.then(function (json) {
                    if (json.message != undefined){
                        self.currentlyEditingStruct = -1
                        self.currentlyEditingStructKey = -1
                        self.getFeeStructure()
                    }
                    console.info('Structure ' + structureId + ' Successfully Deleted');
                    
                });
            }
        },

        addEditFeeType(groupKey){
            this.createStructureList[this.currentlyEditingStructKey].structure[groupKey].fee_types.push({
                amount: "",
                discounts: [],
                fee_term_id: null,
                id: "",
                name: ""
            })
            // this.editedStruct.structure[groupKey].fee_types.push({
            //     amount: -1,
            //     discounts: [-1],
            //     fee_term_id: -1,
            //     id: -1,
            //     name: "-1"        
            // })
            this.structBackup[this.currentlyEditingStructKey].structure[groupKey].fee_types.push({
                amount: -1,
                discounts: [],
                fee_term_id: -1,
                id: -1,
                name: -1
            })
        },

        addEditFeeGroup(structureKey){
            this.createStructureList[structureKey].structure.push({
                due_date: "",
                fee_group_id: null,
                fee_group_name: "",
                fee_types: [{
                    amount: "",
                    discounts: [],
                    fee_term_id: null,
                    id: "",
                    name: ""
                }],
                starting_date: ""
            })

            this.structBackup[structureKey].structure.push({
                due_date: -1,
                fee_group_id: null,
                fee_group_name: -1,
                fee_types: [{
                    amount: -1,
                    discounts: [],
                    fee_term_id: null,
                    id: -1,
                    name: -123
                }],
                starting_date: -1                
            })
        },

        handleStructEditSave(structKey) {
            let context = this
            let validationError = false
            let validationMsg = ""
            let editedKey = structKey
            let editedAttr = [{}]
            for (const editedStructKey in context.createStructureList) {
                let editedStructObj = context.createStructureList[editedStructKey]
                if (context.currentlyEditingStruct == editedStructObj.structure_id) {
                    context.editedStruct = JSON.parse(JSON.stringify(editedStructObj))
                }
            }
            let compStructObj = this.structBackup[structKey]
            if (compStructObj.structure_name != this.editedStruct.structure_name)
                editedAttr[0].structure_name = this.editedStruct.structure_name

            // fee_groups
            editedAttr[0].fee_groups = []
            editedAttr[0].fee_details = []
            for (const editStructKey in context.editedStruct.structure) {
                let feeGroupObj = {}
                if (compStructObj.structure[editStructKey].due_date != context.editedStruct.structure[editStructKey].due_date){
                    feeGroupObj.due_date = convDateRev(context.editedStruct.structure[editStructKey].due_date)
                    if(context.editedStruct.structure[editStructKey].due_date == ""){
                        validationError = true
                        validationMsg = "Due date cannot be empty"
                    }
                }
                if (compStructObj.structure[editStructKey].starting_date != context.editedStruct.structure[editStructKey].starting_date){
                    feeGroupObj.starting_date = convDateRev(context.editedStruct.structure[editStructKey].starting_date)
                    if (context.editedStruct.structure[editStructKey].starting_date == "") {
                        validationError = true
                        validationMsg = "Start date cannot be empty"
                    }
                }
                if (compStructObj.structure[editStructKey].fee_group_name != context.editedStruct.structure[editStructKey].fee_group_name){
                    feeGroupObj.fee_group_name = context.editedStruct.structure[editStructKey].fee_group_name
                    if (context.editedStruct.structure[editStructKey].fee_group_name == ""){
                        validationError = true
                        validationMsg = "Fee group name cannot be empty"
                    }
                }
                if (Object.keys(feeGroupObj).length != 0) {
                    feeGroupObj.fee_group_id = context.editedStruct.structure[editStructKey].fee_group_id
                    if (feeGroupObj.fee_group_id == null){
                        feeGroupObj.fee_types = context.editedStruct.structure[editStructKey].fee_types
                    } else {
                        feeGroupObj.fee_types = []
                    }
                    editedAttr[0].fee_groups.push(feeGroupObj)
                }
                //For Date validation
                if (!validateDate(context.editedStruct.structure[editStructKey].starting_date, context.editedStruct.structure[editStructKey].due_date)){
                    validationError = true
                    validationMsg = "Start date is greater than due date"
                }
                for (const feeTypeKey in context.editedStruct.structure[editStructKey].fee_types) {
                    let feeTypeObj = {}
                    let discountArr = []
                    if (compStructObj.structure[editStructKey].fee_types[feeTypeKey].amount != context.editedStruct.structure[editStructKey].fee_types[feeTypeKey].amount){
                        feeTypeObj.amount = context.editedStruct.structure[editStructKey].fee_types[feeTypeKey].amount
                        if (context.editedStruct.structure[editStructKey].fee_types[feeTypeKey].amount == "") {
                            validationError = true
                            validationMsg = "Fee amount cannot be empty"
                        } if (context.editedStruct.structure[editStructKey].fee_types[feeTypeKey].amount < 0){
                            validationError = true
                            validationMsg = "Fee amount cannot be negative"
                        }
                    }
                    let discArr = context.editedStruct.structure[editStructKey].fee_types[feeTypeKey].discounts
                    if (discArr.length == compStructObj.structure[editStructKey].fee_types[feeTypeKey].discounts.length) {
                        for (const discKey in discArr) {
                            if (discArr[discKey].id != compStructObj.structure[editStructKey].fee_types[feeTypeKey].discounts[discKey].id){
                                discountArr.push(discArr[discKey].id)
                                feeTypeObj.changes_in_discount = true
                            }
                        }
                    } else {
                        if (discArr.length != 0){
                            for (const discKey in discArr) {
                                discountArr.push(discArr[discKey].id)
                                feeTypeObj.changes_in_discount = true
                            }
                        } else {
                            discountArr.push()
                            feeTypeObj.changes_in_discount = true
                        }
                    }
                    if (compStructObj.structure[editStructKey].fee_types[feeTypeKey].id != context.editedStruct.structure[editStructKey].fee_types[feeTypeKey].id) {
                        feeTypeObj.fee_type_id = Number(context.editedStruct.structure[editStructKey].fee_types[feeTypeKey].id)
                        if (context.editedStruct.structure[editStructKey].fee_types[feeTypeKey].id == "") {
                            validationError = true
                            validationMsg = "Fee type not selected"
                        }
                    }
                    // if (compStructObj.structure[editStructKey].fee_types[feeTypeKey].fee_term_id == null) {
                    //     feeTypeObj.fee_term_id = compStructObj.structure[editStructKey].fee_types[feeTypeKey].fee_term_id
                    // }
                    if (discountArr.length != 0)
                        feeTypeObj.discount_groups = discountArr
                    if (feeTypeObj.changes_in_discount == true && discountArr.length == 0)
                        feeTypeObj.discount_groups=[]
                    if (Object.keys(feeTypeObj).length != 0 && compStructObj.structure[editStructKey].fee_types[feeTypeKey].name !== -123) {
                        if (feeTypeObj.changes_in_discount != true){
                            feeTypeObj.changes_in_discount = null
                        }
                        feeTypeObj.fee_term_id = context.editedStruct.structure[editStructKey].fee_types[feeTypeKey].fee_term_id
                        feeTypeObj.fee_group_id = Number(context.editedStruct.structure[editStructKey].fee_group_id)
                        editedAttr[0].fee_details.push(feeTypeObj)
                    }
                    console.log(feeTypeObj)
                }
                console.log(feeGroupObj)
            }
            if (editedAttr[0].fee_groups.length == 0) {
                editedAttr[0].fee_groups = undefined;
                editedAttr[0] = JSON.parse(JSON.stringify(editedAttr[0]));
            }
            if (editedAttr[0].fee_details.length == 0) {
                editedAttr[0].fee_details = undefined;
                editedAttr[0] = JSON.parse(JSON.stringify(editedAttr[0]));
            }
            console.log(editedAttr[0])
            if (editedAttr[0].length != 0 && !validationError) {
                this.patchFeeStructure(editedAttr[0])
            } else {
                if(validationError){
                    this.statusModalData = {
                        responsetype: modalType.warning,
                        responsemsg: validationMsg,
                        showModal: true
                    }
                } else {
                    this.statusModalData = {
                        responsetype: modalType.warning,
                        responsemsg: "No changes made to be saved.",
                        showModal: true
                    }
                }
            }
            // fee_details
            // editedAttr[0].fee_details = []

            console.log("handle struct save")
        },

        editStructureList() {
            this.createStructureList = []
            let feeStructureIds = Object.keys(this.fee_structure_resp.fee_struture)
            let createStructIndex = -1
            let context = this
            for (i = 0; i < feeStructureIds.length; i++) {
                context.fee_structure_resp.fee_struture[feeStructureIds[i]]
                let structureName = context.fee_structure_resp.fee_struture[feeStructureIds[i]].name
                let structureId = feeStructureIds[i]
                context.createStructureList.push({
                    structure_name: structureName,
                    structure_id: structureId,
                    structure: []
                })
                createStructIndex += 1;
                let fee_groups_obj = context.fee_structure_resp.fee_struture[feeStructureIds[i]].fee_groups
                let feeGroupIds = Object.keys(context.fee_structure_resp.fee_struture[feeStructureIds[i]].fee_groups)
                console.log(feeGroupIds)
                for (j = 0; j < feeGroupIds.length; j++) {
                    context.createStructureList[createStructIndex].structure.push({
                        fee_group_id: feeGroupIds[j],
                        fee_group_name: fee_groups_obj[feeGroupIds[j]].name,
                        starting_date: convDateRev(fee_groups_obj[feeGroupIds[j]].starting_date),
                        due_date: convDateRev(fee_groups_obj[feeGroupIds[j]].due_date),
                        fee_types: fee_groups_obj[feeGroupIds[j]].fee_types
                    })
                    // fee_groups_obj[feeGroupIds[j]].fee_types.forEach(feeType => {
                    //     if (feeType.collected){
                    //         context.collectedFee
                    //     }
                    // });
                    console.log(fee_groups_obj[feeGroupIds[j]])
                }
            }
        },

        genFeeStruct() {
            console.log(JSON.stringify(this.postDataCreateStructure));
            let self = this
            apiUrl = '/api/fee_struture/'
            methodType = APIMethod.POST
            dataBody = JSON.stringify(this.postDataCreateStructure)
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                // self.structureName = ''
                self.createStructure = [{
                    name: '',
                    starting_date: '',
                    due_date: '',
                    date_with_fine: '',
                    fine_amnt: 0,
                    fee_types: [],
                }]
                self.createStructure[0].fee_types.push({
                    fee_type_id: 0,
                    fee_type_name: "Select fee name",
                    amount: 0,
                    discount_groups: []
                })
                // self.groupFocus = 0;
                self.clearFeeStructureData()
                self.$forceUpdate();

            });
        },
        addGroup() {
            this.createStructure.push({
                name: '',
                starting_date: '',
                due_date: '',
                date_with_fine: '',
                fine_amnt: 0,
                fee_types: [{
                    fee_type_id: 0,
                    fee_type_name: "Select fee name",
                    amount: 0,
                    discount_groups: []
                }],
            });
            this.groupFocus = this.createStructure.length - 1
            // console.log("number of Groups: " + this.createStructure.length)
        },

        addFeeType(groupKey) {
            this.groupFocus = groupKey;
            this.createStructure[this.groupFocus].fee_types.push({
                fee_type_id: 0,
                fee_type_name: "Select fee name",
                amount: 0,
                discount_groups: []
            })
        },
        feeTypeSelect(e, feeTypeKey, groupKey) {
            this.createStructure[groupKey].fee_types[feeTypeKey].fee_type_id = Number(e.target.selectedOptions[0].id)
            console.log(e)
        },

        editFeeTypeSelect(e, feeTypeKey, groupKey, structKey) {
            this.createStructureList[structKey].structure[groupKey].fee_types[feeTypeKey].id = e.target.selectedOptions[0].id
            this.createStructureList[structKey].structure[groupKey].fee_types[feeTypeKey].name = e.target.value
        },

        removeGroup(key) {
            this.groupFocus = key;
            this.createStructure.splice(key, 1)
        },


        focusChange(key) {
            this.groupFocus = key
        },

        removeFeeType(feeTypeKey, groupKey) {
            console.log(feeTypeKey + ' -------------- ' + groupKey)
            this.groupFocus = groupKey;
            const currentFocus = this.groupFocus
            this.createStructure[currentFocus].fee_types.splice(feeTypeKey, 1)
        },

        clearFeeStructureData() {
            this.validationErrMsg = ''
            this.structureName = ''
            this.postDataCreateStructure = ''
            this.showFeeTypeModal = false
            this.isSaveStruct = false
            this.createStructure = [{
                name: '',
                starting_date: '',
                due_date: '',
                date_with_fine: '',
                fine_amnt: 0,
                fee_types: [{
                    fee_type_id: 0,
                    amount: 0,
                    discount_groups: []
                }],
            }]
            Vue.set(this.createStructure[0], 'fee_types', [{
                fee_type_id: 0,
                fee_type_name: "Select fee name",
                amount: 0,
                discount_groups: []
            }])
            this.concession_group_values = []
            this.concession_group_option = []
            this.groupFocus = 0;
        },

        saveStructure() {
            this.isSaveStruct = true
            let disableSave = true
            console.log('Clicked on save structure');
            const context = this;
            this.postDataCreateStructure = {
                name: this.structureName,
                struture: JSON.parse(JSON.stringify(this.createStructure))
            }
            for (const groupKey in this.postDataCreateStructure.struture) {
                let ftElement = this.postDataCreateStructure.struture[groupKey].fee_types
                //For formatting date to yyyy-mm-dd
                let startDate = context.postDataCreateStructure.struture[groupKey].starting_date
                let endDate = context.postDataCreateStructure.struture[groupKey].due_date
                context.postDataCreateStructure.struture[groupKey].fee_group_name = context.postDataCreateStructure.struture[groupKey].name
                delete context.postDataCreateStructure.struture[groupKey].name
                if (startDate != "" && endDate != "") {
                    if (!validateDate(startDate, endDate)){
                        context.validationErrMsg = "Starting Date is greater than Due Date"
                        disableSave = false
                    }
                    context.postDataCreateStructure.struture[groupKey].starting_date = convDateRev(startDate)
                    context.postDataCreateStructure.struture[groupKey].due_date = convDateRev(endDate)
                }
                for (const ftKey in ftElement) {
                    let dgElement = ftElement[ftKey].discount_groups
                    delete ftElement[ftKey].fee_type_name

                    let discountArray = []
                    for (const key in dgElement) {
                        discountArray.push(dgElement[key].id)
                        dgElement[key].id
                    }

                    //For Validation
                    if (ftElement[ftKey].amount == "") {
                        context.validationErrMsg = "Fee amount not entered"
                        disableSave = false
                    }
                    if (ftElement[ftKey].amount < 0) {
                        context.validationErrMsg = "Fee amount entered is less than zero"
                        disableSave = false
                    }
                    if (ftElement[ftKey].fee_type_id == 0) {
                        context.validationErrMsg = "Fee name not selected"
                        disableSave = false
                    }

                    context.postDataCreateStructure.struture[groupKey].fee_types[ftKey].discount_groups = discountArray;
                    dgElement = discountArray;
                }
                //For Validation
                if (this.createStructure[groupKey].starting_date == "") {
                    disableSave = false
                    context.validationErrMsg = "Starting date not selected"
                }
                if (this.createStructure[groupKey].due_date == "") {
                    disableSave = false
                    context.validationErrMsg = "Due date not selected"
                }
                if (this.createStructure[groupKey].name == "") {
                    disableSave = false
                    context.validationErrMsg = "Fee Group Name not entered"
                }
                if (ftElement.length == 0) {
                    disableSave = false
                    context.validationErrMsg = "No Fee details row added"
                }
            }
            if (this.createStructure.length == 0) {
                disableSave = false
                context.validationErrMsg = "No Fee group added"
            }
            console.log(this.createStructure)
            if (disableSave) {
                // this.postDataCreateStructure = {
                //     name: this.structureName,
                //     struture: this.createStructure
                // }
                this.genFeeStruct();
            } else {
                this.statusModalData = {
                    responsetype: modalType.error,
                    responsemsg: this.validationErrMsg,
                    showModal: true
                }
            }
        },
        //Methods for create fee structure ENDS

        //Methods for Assign structure starts
        genFeeStructList() {
            this.fee_structure_names = []
            let structIdArr = Object.keys(this.fee_structure_resp.fee_struture)
            let context = this
            for (i = 0; i < structIdArr.length; i++) {
                context.fee_structure_names.push({
                    id: structIdArr[i],
                    name: context.fee_structure_resp.fee_struture[structIdArr[i]].name
                })
            }
        },

        handleStudentClassSelection() {

        },

        handleStructSave() {
            this.selectedStudentIds = [];
            var keys = Object.keys(this.student)
            var context = this;
            for (i = 0; i < keys.length; i++) {
                for (j = 0; j < context.student[keys[i]].length; j++) {
                    if (context.student[keys[i]][j].isActive)
                        context.selectedStudentIds.push(context.student[keys[i]][j].id)
                }
                console.log(context.student[keys[i]])
            }
            console.log('selectedStudentIds: ' + this.selectedStudentIds)
        },

        handleTypeSelection(e) {
            //For Student or Class wise selection
            console.log(e);
            console.log(e.target.selectedOptions[0].index);
            this.selectedAssignIndex = e.target.selectedOptions[0].index;
        },
        handleStudentFocus(studentGroupKey) {
            //For setting group focus
            if (studentGroupKey == this.focusedStudentGroup) {
                this.focusedStudentGroup = 0
            } else {
                this.focusedStudentGroup = studentGroupKey;
            }
            this.search = ""
            // console.log(this.focusedStudentGroup);
        },
        handleStudentSelection(studentId, classKey, studentKey) {
            //For student selection multiselect
            let selectedIndiStud = 0

            for (i = 0; i < this.student[this.focusedStudentGroup].length; i++) {
                if (this.student[this.focusedStudentGroup][i].id == studentId) {
                    if (this.student[this.focusedStudentGroup][i].isActive) {
                        Vue.set(this.student[classKey][i], 'isActive', false)
                        this.selectedStudent -= 1
                    } else {
                        Vue.set(this.student[classKey][i], 'isActive', true)
                        this.selectedStudent += 1
                    }
                }
                //For getting number of selected students in a class group
                if (this.student[this.focusedStudentGroup][i].isActive) {
                    selectedIndiStud++
                }
            }

            //For selecting whole class in class wise when All students in Class Group is Selected
            if (selectedIndiStud == this.student[this.focusedStudentGroup].length) {
                for (i = 0; i < this.classList.length; i++) {
                    if (this.focusedStudentGroup == this.classList[i].name) {
                        this.classList[i].isActive = true
                    }
                }
                this.selectedItemsNum += 1
            } else {
                for (i = 0; i < this.classList.length; i++) {
                    if (this.focusedStudentGroup == this.classList[i].name) {
                        this.classList[i].isActive = false
                    }
                }
                if (this.selectedItemsNum != 0)
                    this.selectedItemsNum -= 1
            }

            //     this.selectedStudent -= 1
            // } else {
            //     Vue.set(this.student[classKey][studentKey], 'isActive', true)
            //     this.selectedStudent += 1
            // }
            //For forcefully updating DOM.
            this.$forceUpdate();
            console.log(this.student[classKey][studentKey]);
        },
        handleAssignToggle(classKey) {
            //For class selection in class wise view.
            this.selectedItemsNum = 0
            this.classList[classKey].isActive ? this.classList[classKey].isActive = false : this.classList[classKey].isActive = true;
            
            if (this.classList[classKey].name in this.student){
                for (i = 0; i < this.student[this.classList[classKey].name].length; i++) {
                    if (!this.student[this.classList[classKey].name][i].isActive) {
                        this.student[this.classList[classKey].name][i].isActive = true
                        this.selectedStudent += 1
                    } else {
                        this.student[this.classList[classKey].name][i].isActive = false
                        this.selectedStudent -= 1
                    }
                }
            } else{
                toast.triggerToast("alert-warning", "No students in selected class")
                this.classList[classKey].isActive = false
            }

            for (i = 0; i < this.classList.length; i++) {
                if (this.classList[i].isActive)
                    this.selectedItemsNum += 1
            }
            // if (this.classList[classKey].isActive)
            //     this.selectedItemsNum += 1
            // else
            //     this.selectedItemsNum -= 1

            console.log(this.selectedItemsNum);
        },

        handleSearch(e) {
            this.search = e.target.value;
            // this.$forceUpdate();s
        },

        handleStructureSelect(e) {
            //For handling structure selection
            console.log(e)
            this.selectedStructure = Number(e.target.selectedOptions[0].id)
            let context = this
            let fee_groups = this.fee_structure_resp.fee_struture[e.target.selectedOptions[0].id].fee_groups
            let fee_group_id = Object.keys(fee_groups)
            this.selectedStructureDetail = []
            for (i = 0; i < fee_group_id.length; i++) {
                context.selectedStructureDetail.push(fee_groups[fee_group_id[i]])
            }
            // this.selectedStructureDetail =  {
            //     name: item.name,
            //     fee_types: item.fee_types
            // }

        },
        assignStructure() {
            let isAssignEnabled = true

            this.postAssignStructData = []
            let school_class_ids = []
            for (const sClass in this.classList) {
                let sClassObj = this.classList[sClass]
                if (sClassObj.isActive) {
                    school_class_ids.push(sClassObj.id)
                }
            }

            let students_ids = []
            for (const sStudent in this.student) {
                let studentArr = this.student[sStudent]
                for (const stud in studentArr) {
                    let studObj = studentArr[stud]
                    if (studObj.isActive) {
                        students_ids.push(studObj.id)
                    }
                }
            }

            //For Validation
            if (school_class_ids.length == 0 && students_ids.length == 0) {
                isAssignEnabled = false
                this.validationErrMsg = "No Students or Classes selected to Assign"
            }

            if (this.selectedStructure == '') {
                isAssignEnabled = false
                this.validationErrMsg = "No Structure selected to Assign"
            }

            let context = this
            this.postAssignStructData.push({
                struture_id: context.selectedStructure,
                school_class_ids: school_class_ids,
                students_ids: students_ids
            })

            if (isAssignEnabled) {
                this.copyAssignStructure()
            } else {
                this.statusModalData = {
                    responsetype: modalType.error,
                    responsemsg: this.validationErrMsg,
                    showModal: true
                }
            }

        },
        //Methods for Assign structure ends

        //End 0f createFeeStructure

        //this is added by jithin on 11-04-2019 for saving the fee discount

        clearDiscountGroup() {
            this.createDiscount = ({
                discountName: '',
                discountAmout: '',
                is_percentage: false,
                discount_save_clicked: false,
                discountNameErrorLabel: "Please Enter Category Name",
                discountAmountErrorLabel: "Please Enter Discount Amount",
            });
        },

        // the same mehthod is used to POST and PATCH the data based on the index value -1 of POST
        saveFeeDiscount(index = null, key = null) {
            discountStudentArray = [];
            studentId = -1;
            if (index == -1) {
                this.createDiscount.discount_save_clicked = true;
                discountName = this.createDiscount.discountName
                discountAmout = this.createDiscount.discountAmout
                is_percentage = this.createDiscount.is_percentage
                for (const key in this.multiselectStudentValue) {
                    const element = this.multiselectStudentValue[key];
                    studentId = parseInt(element.feeDiscountStudentId);
                    discountStudentArray.push(studentId);
                }
                apiUrl = "/api/fee_discount/"
                apiMethodType = "POST"
            } else {
                // alert(this.listDiscount[index]['name'])
                // this.listDiscount[index]["dataDisabled"] = true
                discountName = this.listDiscount[index]['name']
                discountAmout = this.listDiscount[index]['value']
                is_percentage = this.listDiscount[index]['is_percentage']
                apiUrl = "/api/fee_discount/" + index
                apiMethodType = "PATCH"
            }
            this.createDiscount.discountNameErrorLabel = "Please Enter Category Name"
            // this.createDiscount.discount_save_clicked = true;
            this.$forceUpdate();
            if (discountName == '' || discountAmout == '' || discountAmout != '' &&
                (parseFloat(discountAmout) != discountAmout || parseFloat(discountAmout) < 0)) {
                this.statusModalData = {
                    responsetype: modalType.warning,
                    responsemsg: "Please Check the Values",
                    showModal: true
                }
            } else if (is_percentage && parseFloat(discountAmout) > 100) {
                this.statusModalData = {
                    responsetype: modalType.warning,
                    responsemsg: "Discount Cannot be Greater than 100%",
                    showModal: true
                }
                
            } else {
                send = [{
                    "name": discountName,
                    "value": parseFloat(discountAmout),
                    "is_percentage": is_percentage,
                    "students": discountStudentArray
                }]
                let self = this
                methodType = apiMethodType
                dataBody = JSON.stringify(send)
                data = commonApiCall(apiUrl, methodType, dataBody)
                data.then(function (json) {
                    self.multiselectStudentValue = [];
                    self.clearDiscountGroup()
                    self.getFeeDiscount()
                });
            }

        },
        editFeeDiscount(index) {
            this.listDiscount[index]["dataDisabled"] = false
            this.$forceUpdate();
        },
        getFeeDiscount() {

            let self = this
            apiUrl = '/api/fee_discount/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                self.listDiscount = []
                self.listDiscount = json.data.fee_discounts;
                for (const key in self.listDiscount) {
                    const element = self.listDiscount[key];
                    element["dataDisabled"] = true
                }
            });
        },
        listStudents() {
            let self = this
            apiUrl = '/api/student/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                self.list_students = json.data.students;
                self.multiselectStudentOptions = []
                for (const schoolClass in self.list_students) {
                    studentArray = []
                    for (const studentObj in json.data.students[schoolClass]) {
                        const student = json.data.students[schoolClass][studentObj];
                        studentArray.push({
                            feeDiscountStudent: student.name,
                            feeDiscountStudentId: student.id
                        })
                    }
                    self.multiselectStudentOptions.push({
                        className: schoolClass,
                        feeDiscountStudentList: studentArray
                    });
                }
            });
        },
        clearMultiselect() {
            this.multiselectStudentValue = []
        },

        deleteFeeDiscount(key) {
            if (!this.twoBtnModalData.show2BtnModal) {
                this.twoBtnModalData.params = [key]
                this.twoBtnModalData.show2BtnModal = true
                this.twoBtnModalData.methodToRun = 1
                this.twoBtnModalData.proceedClicked = false
            }
            if (this.twoBtnModalData.proceedClicked) {
                let self = this
                apiUrl = '/api/fee_discount/' + key
                methodType = APIMethod.DELETE
                dataBody = null
                data = commonApiCall(apiUrl, methodType, dataBody)
                data.then(function (json) {
                    self.getFeeDiscount()
                });
            }
        },
        changePageForClass(){
            this.isClassId = true
            this.changePage('student_fee')
           
        },
        changePage(val) {
            this.statusModalData.showModal = false
            if (val === 'create_struture') {
                this.currentlyEditingStruct = -1
                this.currentlyEditingStructKey = -1
                this.createStructureTab = {
                    createStructure: true,
                    editStructure: false
                }
                this.getFeeTypes()
                this.getDiscountGroup()
            }
            if (val === 'assign_struture') {
                this.fee_structure_resp = []
                this.clearAssignStructure()
                // this.getStudentsList()
                // this.getFeeStructure()
                // this.getSchoolClasses()
            }
            if (val === 'concession_category') {
                this.multiselectStudentValue = []
                this.multiselectStudentOptions = []
                this.$forceUpdate()
                this.clearDiscountGroup()
                this.getFeeDiscount()
                this.listStudents()

            }
            if (val === 'student_fee') {
                this.searchQuery='';
                this.paymentmethod='Cash'; 
                if(!this.isClassId){
                    this.classListDropDown=''
                this.getStudentFeeList()
                }
                else{
                    this.isClassId=false
                    this.gridDataCount = 1
                    axios.get('/api/student_fee/', {
                        params: {
                            school_class_id: this.classId
                        }
                    }).then(json => {
                        // console.log(json.data.data.student_fee_list);
                        if (json.data.data) {
                            this.hide_alert_class = false;
                            this.list_students_fee = json.data.data.student_fee_list;
                            this.gridDataForNonstructured = []
                            console.log(this.gridData)
                            this.gridData.splice(0, this.gridData.length)
                            this.gridDataCount = 1
                            for (const studentFee in this.list_students_fee) {
                                if (this.list_students_fee[studentFee].actual_amount !== null) {
                                    this.gridData.push({
                                        id: this.list_students_fee[studentFee].student_id,
                                        Slno: this.gridDataCount++,
                                        StudentName: this.list_students_fee[studentFee].student_name,
                                        Class: this.list_students_fee[studentFee].school_class,
                                        FatherName: this.list_students_fee[studentFee].guardian_name,
                                        ContactNumber: this.list_students_fee[studentFee].guardian_phone,
                                        BookNumber: this.list_students_fee[studentFee].book_no,
                                        AdmissionNumber: this.list_students_fee[studentFee].admission_no,
                                        NetPayable: this.list_students_fee[studentFee].actual_amount,
                                        Due: this.list_students_fee[studentFee].due_amount,
                                        Paid: this.list_students_fee[studentFee].paid_amout
                                    })
                                } else {
                                    this.gridDataForNonstructured.push({
                                        id: this.list_students_fee[studentFee].student_id,
                                        Slno: this.gridDataCountNonStructured++,
                                        StudentName: this.list_students_fee[studentFee].student_name,
                                        Class: this.list_students_fee[studentFee].class,
                                        FatherName: this.list_students_fee[studentFee].guardian_name,
                                        ContactNumber: this.list_students_fee[studentFee].guardian_phone,
                                        BookNumber: this.list_students_fee[studentFee].book_no,
                                        AdmissionNumber: this.list_students_fee[studentFee].admission_no,
                                        NetPayable: this.list_students_fee[studentFee].actual_amount,
                                        Due: this.list_students_fee[studentFee].due_amout,
                                        Paid: this.list_students_fee[studentFee].paid_amout
                                    })
                                }
                            }
                        }

                    })
                }
                this.getSchoolClasses()
                // this.onChange(this.event)
            }
            if (val === 'transportation_route_fee') {
                 this.getStudentDetails()
                this.getFeeTerms()
                this.month_name2 = this.month_name.slice()
                this.bus_key = -1
                this.create_fee_term = [{
                    term_name: "",
                    start_date: "",
                    end_date: "",
                    terms_details: []
                }]
                

            }
            for (var key in this.page) {
                this.page[key] = false
            }
            this.page[val] = true
        },
        calulateDiscount(val,val2) {
            // for (const fee in this.list_students_fee_individual.terms) {
            if (this.list_students_fee_individual.terms[val2].fees[val].Discount != '' && this.list_students_fee_individual.terms[val2].fees[val].Discount <= parseInt(this.list_students_fee_individual.terms[val2].fees[val].OriginalPay) && this.list_students_fee_individual.terms[val2].fees[val].Discount > 0)
                this.list_students_fee_individual.terms[val2].fees[val].due_amount = parseInt(this.list_students_fee_individual.terms[val2].fees[val].OriginalPay) - parseInt(this.list_students_fee_individual.terms[val2].fees[val].Discount);
                else{
                if (this.list_students_fee_individual.terms[val2].fees[val].Discount >= parseInt(this.list_students_fee_individual.terms[val2].fees[val].OriginalPay)){
                        this.statusModalData = {
                            responsetype: modalType.warning,
                            responsemsg: "Entered discount is greater than actual amount ",
                            showModal: true
                        }
                    }
                this.list_students_fee_individual.terms[val2].fees[val].Discount='';
                this.list_students_fee_individual.terms[val2].fees[val].due_amount = parseInt(this.list_students_fee_individual.terms[val2].fees[val].OriginalPay) - 0;
                // }
            }
        // }
        },
        calculateAmountpay(val,val2){
            // for (const fee in this.list_students_fee_individual.terms) {
            if (this.list_students_fee_individual.terms[val2].fees[val].due_amount > this.list_students_fee_individual.terms[val2].fees[val].OriginalPay || this.list_students_fee_individual.terms[val2].fees[val].due_amount <0)
                this.list_students_fee_individual.terms[val2].fees[val].due_amount = this.list_students_fee_individual.terms[val2].fees[val].OriginalPay;

            // }
        },
        onChange(event) {
            this.classId ='';
            if (event.target.value=="ALL")
                this.classId =""
            else
            this.classId = event.target.value
            this.gridDataCount = 1
            axios.get('/api/student_fee/', {
                params: {
                    school_class_id: this.classId
                }
            }).then(json => {
                // console.log(json.data.data.student_fee_list);
                if (json.data.data){
                    this.hide_alert_class = false;
                this.list_students_fee = json.data.data.student_fee_list;
                this.gridDataForNonstructured = []
                console.log(this.gridData)
                this.gridData.splice(0, this.gridData.length)
                this.gridDataCount = 1
                for (const studentFee in this.list_students_fee) {
                    if (this.list_students_fee[studentFee].actual_amount !== null) {
                        this.gridData.push({
                            id: this.list_students_fee[studentFee].student_id,
                            Slno: this.gridDataCount++,
                            StudentName: this.list_students_fee[studentFee].student_name,
                            Class: this.list_students_fee[studentFee].school_class,
                            FatherName: this.list_students_fee[studentFee].guardian_name,
                            ContactNumber: this.list_students_fee[studentFee].guardian_phone,
                            BookNumber: this.list_students_fee[studentFee].book_no,
                            AdmissionNumber: this.list_students_fee[studentFee].admission_no,
                            NetPayable: this.list_students_fee[studentFee].actual_amount,
                            Due: this.list_students_fee[studentFee].due_amount,
                            Paid: this.list_students_fee[studentFee].paid_amout
                        })
                    }else{
                        this.gridDataForNonstructured.push({
                            id: this.list_students_fee[studentFee].student_id,
                            Slno: this.gridDataCountNonStructured++,
                            StudentName: this.list_students_fee[studentFee].student_name,
                            Class: this.list_students_fee[studentFee].class,
                            FatherName: this.list_students_fee[studentFee].guardian_name,
                            ContactNumber: this.list_students_fee[studentFee].guardian_phone,
                            BookNumber: this.list_students_fee[studentFee].book_no,
                            AdmissionNumber: this.list_students_fee[studentFee].admission_no,
                            NetPayable: this.list_students_fee[studentFee].actual_amount,
                            Due: this.list_students_fee[studentFee].due_amout,
                            Paid: this.list_students_fee[studentFee].paid_amout
                        })
                    }
                }
            }
            else{
                var self=this;
                    this.hide_alert_class = true;
                    setTimeout(function () { 
                        self.hide_alert_class=false; }
                        , 3000  );
                    // async function demo() {
                       
                    // await sleep(2000);
                    // this.hide_alert=false;
                    // }

            }


            })
            this.$forceUpdate();
        },
        getStudentFeeList() {
            let self = this
            apiUrl = '/api/student_fee/'
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                self.list_students_fee = json.data.student_fee_list;
                self.gridDataForNonstructured = []
                self.gridDataCount = 1
                self.gridDataCountNonStructured = 1
                self.gridData.splice(0, self.gridData.length)

                for (const studentFee in self.list_students_fee) {
                    if (self.list_students_fee[studentFee].actual_amount != null) {
                        self.gridData.push({
                            id: self.list_students_fee[studentFee].student_id,
                            Slno: self.gridDataCount++,
                            StudentName: self.list_students_fee[studentFee].student_name,
                            Class: self.list_students_fee[studentFee].school_class,
                            FatherName: self.list_students_fee[studentFee].guardian_name,
                            ContactNumber: self.list_students_fee[studentFee].guardian_phone,
                            BookNumber: self.list_students_fee[studentFee].book_no,
                            AdmissionNumber: self.list_students_fee[studentFee].admission_no,
                            NetPayable: self.list_students_fee[studentFee].actual_amount,
                            Due: self.list_students_fee[studentFee].due_amount,
                            Paid: self.list_students_fee[studentFee].paid_amout
                        }

                        )

                    } else {
                        self.gridDataForNonstructured.push({
                            id: self.list_students_fee[studentFee].student_id,
                            Slno: self.gridDataCountNonStructured++,
                            StudentName: self.list_students_fee[studentFee].student_name,
                            Class: self.list_students_fee[studentFee].school_class,
                            FatherName: self.list_students_fee[studentFee].guardian_name,
                            ContactNumber: self.list_students_fee[studentFee].guardian_phone,
                            BookNumber: self.list_students_fee[studentFee].book_no,
                            AdmissionNumber: self.list_students_fee[studentFee].admission_no,
                            NetPayable: self.list_students_fee[studentFee].actual_amount,
                            Due: self.list_students_fee[studentFee].due_amout,
                            Paid: self.list_students_fee[studentFee].paid_amout
                        })
                    }


                }
            });

        },
        getStudentIndividualFeeDetails(val) {
            let self = this
            apiUrl = '/api/student_fee/' + val
            methodType = APIMethod.GET
            dataBody = null
            data = commonApiCall(apiUrl, methodType, dataBody)
            data.then(function (json) {
                for (const term in json.data.student_fee.terms) {
                    for (const feeList in json.data.student_fee.terms[term].fees) {
                        //   for(const fee in feeList.fees){
                        //   fee["ToPay"]= true
                        // alert(JSON.stringify(json.data.student_fee.terms[term].fees[feeList].due_amount))
                        json.data.student_fee.terms[term].fees[feeList]['ToPay'] = false
                        json.data.student_fee.terms[term].fees[feeList]['OriginalPay'] = json.data.student_fee.terms[term].fees[feeList].due_amount
                        json.data.student_fee.terms[term].fees[feeList]['Discount'] = ''
                    }
                    //       

                }
                self.list_students_fee_individual = json.data.student_fee;

            });

        },

        getFeeReciept(val) {
            // window.location.href = '/partialload/reciept/'+val
            fetch('/partialload/reciept/' + val, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (resp) {
                return resp.blob();
            }).then(function (blob) {
                download(blob, val + '.pdf');

            })

            toast.triggerToast('alert-danger', 'Payment successfull                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         ')
            this.changePage('student_fee')
        },
        payHideOrNot(){
            // var gg=tr
            this.details1=[];
            for (const term in this.list_students_fee_individual.terms) {
                for (const saveFee in this.list_students_fee_individual.terms[term].fees) {
                    if (this.list_students_fee_individual.terms[term].fees[saveFee].ToPay == true) {
                        this.details1.push({
                            "student_fee_id": this.list_students_fee_individual.terms[term].fees[saveFee].student_fee_id,
                            "amount_pay": parseInt(this.list_students_fee_individual.terms[term].fees[saveFee].due_amount),
                            "additional_discount": parseInt(this.list_students_fee_individual.terms[term].fees[saveFee].Discount)
                        })
                    }


                }
            }
            if(this.details1.length>0)
            return true
            else
            return false
            
        },
        addCollection() {
            if (!this.twoBtnModalData.show2BtnModal) {
                this.twoBtnModalData.show2BtnModal = true
                this.twoBtnModalData.methodToRun = 2
                this.twoBtnModalData.responsemsg = "Do you want to pay"
                this.twoBtnModalData.proceedClicked = false
            }
            if (this.twoBtnModalData.proceedClicked) {
                this.details = []
                this.save_feelist = []
                for (const term in this.list_students_fee_individual.terms) {
                    for (const saveFee in this.list_students_fee_individual.terms[term].fees) {
                        if (this.list_students_fee_individual.terms[term].fees[saveFee].ToPay == true) {
                            this.details.push({
                                "student_fee_id": this.list_students_fee_individual.terms[term].fees[saveFee].student_fee_id,
                                "amount_pay": parseInt(this.list_students_fee_individual.terms[term].fees[saveFee].due_amount),
                                "additional_discount": parseInt(this.list_students_fee_individual.terms[term].fees[saveFee].Discount)
                            })
                        }


                    }
                }
                this.save_feelist.push({
                    "payment_mode": this.paymentmethod,
                    "total": this.totalAmount,
                    "payment_details": this.paymentDetails,
                    "details": this.details

                })
                // console.log(JSON.stringify(this.save_feelist))
                // here need to change the method with the commonApiCall
                // let self = this
                // apiUrl = '/api/student_fee/'
                // methodType = APIMethod.OPTIONS
                // dataBody = null
                // data = commonApiCall(apiUrl, methodType, dataBody)
                // data.then(function (json) {
                //     alert(JSON.stringify(json))
                //     alert(json)
                // });

                fetch('/api/student_fee/', {
                    method: APIMethod.OPTIONS,
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.save_feelist)
                }).then(response => {
                    if (response.status == 403) {
                        this.hide_alert = true
                    } else {
                        return response.json()
                    }

                }).then(json => {
                    this.getFeeReciept(json.data.reciept_id)
                })

            }

            //     if (response.status == 200) {

            //         console.log(response.)
            //         // this.getFeeReciept(response.json.data.reciept_id),
            // this.statusModalData = {
            //     responsetype: modalType.success,
            //     responsemsg: modalMsg.saveSuccess,
            //     showModal: true
            // }
            // }
            // else {
            //     this.statusModalData = {
            //     responsetype: modalType.error,
            //     responsemsg: modalMsg.basicError,
            //     showModal: true
            //     }
            //     }
            // })


        },
     



        // computed: {
        //     totalAmount () {
        //         var output =0
        //        for(i=0;i<this.individualStudentFee.length;i++){
        //            if (this.individualStudentFee[i].ToPay){
        //            if (!this.individualStudentFee[i].Pay=='')
        //            output += parseInt(this.individualStudentFee[i].Pay)
        //            }


        //        }
        //           return output
        //     },

        // },


        created() {
            // this.getFeeTypes()
        }

    }
})
