//For managing console logging in Development and Production
let devLogs = true;
let prodLogs = true;

let globalDebug = (() => {
    const savedConsole = console;
    return (debugOn, suppressAll) => {
        let suppress = suppressAll || true;
        if (debugOn === false) {
            console = {};
            console.log = function () { };
            if (!suppress) {
                console.info = function () { };
                console.warn = function () { };
                console.error = function () { };
            } else {
                console.info = savedConsole.info;
                console.warn = savedConsole.warn;
                console.error = savedConsole.error;
            }
        } else {
            console = savedConsole;
        }
    }
})(); globalDebug(devLogs, prodLogs);

// Uncomment this line to disable alerts
// alert = function () { };

const APIMethod = {
    GET : "GET",
    POST : "POST",
    PATCH : "PATCH",
    DELETE : "DELETE",
    OPTIONS : "OPTIONS",
}

const modalMsg = {
    //Success Messages
    basicSuccess: " Success! ",
    saveSuccess: " Successfully Saved! ",
    detailSaveSuccess: " Saved Successfully ",
    detailDeletedSuccess: " Deleted Successfully ",

    //Error Messages
    basicError: " Error! ",
    fetchError: " Error While Collecting Data ",
    fetchDetailError: " Error Fetching ",
    deleteDetailError: " Error While Deleting ",
    saveDetailError: " Error While Saving Data ",
    authorisationError: " Not Authorised ",
}

const modalType = {
    error: "error",
    warning: "warning",
    success: "success"
}

// Common methods
//To convert date from yyyy-mm-dd to dd-mm-yyyy and vis-a-vis
function convDateRev(date) {
    return date.split("-").reverse().join("-");
}

//To allow only integers in input field
function allowNumbersOnly(e) {
    var code = (e.which) ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
        e.preventDefault();
    }
}

function setFocus(ind) {
    let s = "focus" + ind
    document.getElementById(s).focus();
    document.getElementById(s).select();
}


//For start date end date validation
function validateDate(startDate, endDate) {
    let date1 = new Date()
    let date2 = new Date()
    startDate = startDate.split("-")
    endDate = endDate.split("-")
    date1.setFullYear(startDate[2], startDate[1], startDate[0])
    date2.setFullYear(endDate[2], endDate[1], endDate[0])
    if (date1 > date2)
        return false
    else
        return true
}

//For adding delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Number format check
const numFormat = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

// async function demo() {
//     console.log('Taking a break...');
//     await sleep(2000);
//     console.log('Two seconds later, showing sleep in a loop...');
// }

//Fetch API intercept
var _oldFetch = fetch
let reqNum = 0
window.fetch = function () {
    var fetchStart = new Event('fetchStart', {
        'view': document,
        'bubbles': true,
        'cancelable': false
    })
    var fetchEnd = new Event('fetchEnd', {
        'view': document,
        'bubbles': true,
        'cancelable': false
    })
    var fetchCall = _oldFetch.apply(this, arguments)
    reqNum++
    document.dispatchEvent(fetchStart)
    fetchCall.then(function () {
        fetchCall.then(response => {
            //For reloading the page on 401
            if(response.status == 401)
                window.location.reload()
        })
        reqNum--
        document.dispatchEvent(fetchEnd)
    }).catch(function () {
        reqNum--
        document.dispatchEvent(fetchEnd)
    })
    return fetchCall
}
document.addEventListener('fetchStart', function () {
    if (reqNum == 1){
        loader.showLoader = true
    }
})
document.addEventListener('fetchEnd', function () {
    if (reqNum == 0){
        loader.showLoader = false
    }
})
//Fetch API intercept for triggering spinner END

//Loader Module
const loader = new Vue({
    el: "#loader",
    delimiters: ["<%", "%>"],
    data:  {
        showLoader: false
    }
})
//Loader Module

//Toast Global Module
const toast = new Vue({
    el: "#toast",
    delimiters: ["<%", "%>"],
    data: {
        alert: 'alert',
        alertType: 'alert-success',
        toastMsg: 'toastMsg',
        showToast: false
    },
    methods: {
        async triggerToast(alertType, msg, length = 5000){
            this.alertType = alertType
            this.toastMsg = msg
            this.showToast = true
            await sleep(length);
            this.showToast = false
        }
    }
})
//Toast Global Module

//*Components for modals */
// Component for default Reponse Modal
Vue.component('modal', {
    delimiters: ["<%", "%>"],
    template: '#modal-template',
    props: ['responsetype', 'responsemsg', 'data'],
})
// Component for default Reponse Modal ENDS

Vue.component('modal-2btn', {
    delimiters: ["<%", "%>"],
    template: '#modal-template-2btn',
    props: ['responsetype', 'responsemsg', 'data'],
})

// Component for creating new FeeType in Create Structure
Vue.component('fee-type-modal', {
    delimiters: ["<%", "%>"],
    template: '#fee-type-modal',
    props: ['existingfeetypes'],
    data: function () {
        return {
            feeTypeData: [{
                name: "",
                description: ""
            }],
            isSaveErr: false,
            isValidationErr: "",
            isSuccess: ""
            
        }
    },
    methods: {
        addFeeTypeDet() {
            this.feeTypeData.push({
                name: "",
                description: ""
            })
            //  this.scrollToEnd()
        },
        // scrollToEnd(){
        //     console.log(this)
        //   //  window.scrollTo(0, document.querySelector("#fee-type-modal").scrollHeight);
        //     //this.$refs.myModal.scrollTop = this.$refs.myModal.scrollHeight
        //     // let element = this.$refs.modal.$el
        //     var container = this.$el.children[0].children[0].children[1];
        //     container.scrollToEnd = container.scrollHeight;
        //     // // container.scrollTop +=350
        //      console.log(container.scrollToEnd,container.scrollTop)

        // },
        removePanel(key) {
            this.feeTypeData.splice(key, 1)
        },

        postFeeType() {
            let context = this
            this.isValidationErr = ""
            this.isSuccess = ""
            let duplicate = false
            for (var i = 0; i < this.feeTypeData.length; i++) {
                for (var j = 0; j < this.feeTypeData.length; j++) {
                    if (i != j) {
                        if (this.feeTypeData[i].name == this.feeTypeData[j].name) {
                            duplicate = true
                        }
                    }
                }
            }
            for (const feeType in this.feeTypeData) {
                const feeTypeObj = this.feeTypeData[feeType]
                if (feeTypeObj.name == "") context.isValidationErr = "Fee Name not entered"
                for (const types in this.existingfeetypes) {
                    if (this.existingfeetypes[types].name == feeTypeObj.name)
                        context.isValidationErr = "Fee Name Already Exists"
                }
            }
            if(duplicate == true){
                context.isValidationErr = "Same Fee Name(s) Entered"
            }
            console.log(this.feeTypeData)
            console.log(JSON.stringify(this.feeTypeData))
            if (this.isValidationErr == "")
                fetch('/api/fee_type/', {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(this.feeTypeData)
                }).then(response => {
                    console.log(response)
                    if (response.status == 200) {
                        this.feeTypeData = [{
                            name: "",
                            description: ""
                        }]
                        this.isSaveErr = false
                        toast.triggerToast('alert-success', 'Fee Type(s) Successfully Saved')
                        this.isSuccess = "Fee Type(s) Successfully Saved"
                        app.getFeeTypes()
                    } else {
                        this.isSaveErr = true
                    }
                }).catch(error => {
                    console.log(error)
                })
        }
    }
})
// Component for creating new FeeType in Create Structure ENDS


// // this is added by jithin on 13-05-2019 for the common Api Call handling

function commonApiCall(apiUrl, methodType, dataBody=null) {
    return fetch(apiUrl, {
            method: methodType,
            body: dataBody,
            credentials: 'include',
            // headers: {
            //     "Content-Type": "application/json"
            // }
        })
        .then(response => {
            if (response.status == 200) {
                if (methodType == 'POST' || methodType == 'PATCH' || methodType == 'OPTIONS'){
                    app.statusModalData.showModal = true
                    app.statusModalData.responsetype = modalType.success
                    app.statusModalData.responsemsg = modalMsg.detailSaveSuccess
                }
                else if(methodType == 'DELETE' ){
                app.statusModalData.showModal = true
                app.statusModalData.responsetype = modalType.success
                app.statusModalData.responsemsg = modalMsg.detailDeletedSuccess
                }
                return response.json()
            } else{
                app.statusModalData.showModal = true
                app.statusModalData.responsetype = modalType.error
                if (methodType == 'POST' || methodType == 'PATCH' || methodType == 'OPTIONS') {
                    app.statusModalData.responsemsg = modalMsg.saveDetailError
                } else if (methodType == 'GET') {
                    app.statusModalData.responsemsg = modalMsg.fetchError

                } else if (methodType == 'DELETE') {
                    app.statusModalData.responsemsg = modalMsg.deleteDetailError
                } else {
                    app.statusModalData.responsemsg = modalMsg.basicError
                }

                if (response.status == 401) {
                    window.location.reload()
                } else if (response.status == 403) {
                    app.statusModalData.responsemsg = modalMsg.authorisationError
                } else if (response.status == 409) {
                } else {
                }
                    return response.status
            } 
        })
}
