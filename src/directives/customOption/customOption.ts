import { Component, Input, Output, EventEmitter } from '@angular/core';
import forEach from 'lodash/forEach';
import pull from 'lodash/pull';
import merge from 'lodash/merge';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FileChooser } from 'ionic-native';

@Component({
    selector: 'custom',
    templateUrl: 'custom.html'
})
export class CustomOption {
    @Input() data: any = "";
    @Output() onChange = new EventEmitter();
    currencySign: string;
    custom_option: any = [];
    month: any;
    textData: any = {};
    textarea: any = {};
    textAreaPrice: any = {};
    selectMulti: any = [];
    select: any = [];
    radio: any = [];
    checkData: any = [];
    check: any = [];
    fileData: any = {};
    time: any;
    multiPrice: any = [];
    selectPrice: any = [];
    checkPrice: any = [];
    textPrice: any = {};
    fileDataValue: any = [];
    jsonFileData: any = [];
    jsonFileDataValue = {};
    jsonDateTimeData: any = {};
    jsonTimeData: any = {};
    jsonDateData: any = {};
    dateData: string;
    dateJson: any = {};
    selectObj: any = {};
    Radioobj: any = {};
    multiObj: any = {};
    checkObj: any = {};
    timeJson: any = {};
    datTimeeJson: any = {};
    textSubdata;
    textAreaSubdata;
    selectSubdata;
    radioSubdata;
    multiSubdata;
    checkSubData;
    fileSubData;
    datePrice;
    timePrice;
    dateTimePrice;
    radioHidden: boolean = true;
    checkHidden: boolean = true;
    keys: any = [];
    validate: FormGroup;
    curYear: any;
    validateArray: any = [];
    price: number;
    timeSubData;
    dateSubData;
    datTimeeSubData;
    date: any;
    constructor(private _fb: FormBuilder) { }
    ngOnInit() {
        var dateObj = new Date();
        this.curYear = dateObj.getFullYear();
        this.currencySign = this.data.body.data.currency_sign;
        this.validateArray = [];
        this.price = this.data.body.data.final_price;
        this.custom_option = this.data.body.data.product_custom_option;
        forEach(this.custom_option, (value, key) => {
            value.id = key;
            value.visable = true;
            value.vertualArray = [];
            value.vertualId = false;
            if (value.is_require == "1") {
                this.validateArray.push({ "id": value.id, "validate": true });
            } else {
                this.validateArray.push({ "id": value.id, "validate": false });
            }
            forEach(value.option_type, (data, id) => {
                data.defaultSet = false;
                data.disable = false;
                if (data.price_type == "percent") {
                    let interest = ((this.price * 1) * (data.price * 1)) / 100;
                    data.price = interest;
                    data.default_price = interest;
                }
            })
            this.keys.push(value.type);
            if (value.type == "date_time") {
                this.jsonDateTimeData = {
                    "option_id": value.option_type[0].option_id,
                    "option_Price": value.option_type[0].price
                }
            }
            if (value.type == "time") {
                this.jsonTimeData = {
                    "option_id": value.option_type[0].option_id,
                    "option_Price": value.option_type[0].price
                }
            }
            if (value.type == "date") {
                this.jsonDateData = {
                    "option_id": value.option_type[0].option_id,
                    "option_Price": value.option_type[0].price
                }
            }
            if (value.type == "file") {
                var obj = {
                    "option_id": value.option_type[0].option_id,
                    "option_url": "",
                    "option_Price": "",
                    "file": "",
                    "disable": "",
                    "options": "",
                    "uri": ""
                }
                this.jsonFileData.push(obj);
            }
        })
    }
    text(opt, formId, is_require) {
        var val: any = [];
        forEach(this.textData, (value) => {
            val = value;
        })
        if (val.length > 0) {
            this.formValidate(formId, false, is_require);
            this.validateArray.iid
            this.textPrice = { "price": opt.price };
            this.textSubdata = { "field": opt };
        }
        else {
            this.formValidate(formId, true, is_require);
            this.textPrice = { "price": 0 };
            this.textSubdata = { "area": "" };
        }
        this.bundleJson();
    }
    textArea(opt, formId, is_require) {
        var val;
        forEach(this.textarea, function(value) {
            val = value;
        })
        if (val.length > 0) {
            this.formValidate(formId, false, is_require);
            this.textAreaPrice = { "price": opt.price };
            this.textAreaSubdata = { "area": opt };
        }
        else {
            this.formValidate(formId, true, is_require);
            this.textAreaPrice = { "price": 0 };
            this.textAreaSubdata = { "area": "" };
        }
        this.bundleJson();
    }
    onChangeSelect(data, formId, is_require) {
        //        this.bundleJson();
        this.selectObj = {};
        forEach(this.custom_option, (value) => {
            if (value.type == "drop_down" && value.vertualId) {
                this.selectObj[value.vertualId.option_id] = value.vertualId.option_type_id;
            }
        });
        console.log(this.selectObj)
        this.formValidate(formId, false, is_require);
    }
    onChangeRadio(formId, is_require) {
        this.Radioobj = {};
        forEach(this.custom_option, (value) => {
            if (value.type == 'radio' && value.vertualId) {
                this.Radioobj[value.vertualId.option_id] = value.vertualId.option_type_id;
            }
        });
        this.formValidate(formId, false, is_require);
        console.log(this.Radioobj)
    }
    onChangeMulti(data, formId, i, is_require) {
        //        this.bundleJson();
        this.multiObj = {};
        forEach(this.custom_option, (value) => {
            if (value.type == 'multiple') {
                forEach(value.vertualArray, (multiSelectData) => {
                    if (!this.multiObj[multiSelectData.option_id]) {
                        this.multiObj[multiSelectData.option_id] = [];
                    }
                    this.multiObj[multiSelectData.option_id].push(multiSelectData.option_type_id);
                });
            }
        });
        if (data.length > 0) {
            this.formValidate(formId, false, is_require);
        }
        else {
            this.formValidate(formId, true, is_require);
        }
    }
    onChangeCheck(selection, event, formId, is_require) {
        this.checkObj = {};
        var countCheck = 0;
        forEach(selection, (value, key) => {
            if (value) {
                if (value.defaultSet == true) {
                    countCheck++;
                }
            }
        })

        forEach(this.custom_option, (valueItems) => {
            if (valueItems.type == "checkbox") {
                forEach(valueItems.option_type, (value) => {
                    if (value.defaultSet == true) {
                        if (!this.checkObj[value.option_id]) {
                            this.checkObj[value.option_id] = [];
                        }
                        this.checkObj[value.option_id].push(value.option_type_id);
                    }
                })
            }
        });
        console.log(this.checkObj)
        if (countCheck > 0) {
            this.formValidate(formId, false, is_require);
        }
        else {
            this.formValidate(formId, true, is_require);
        }
    }
    file(event, opt, formId, is_require) {
        let fileArray: any = [];
        console.log(opt)
        this.formValidate(formId, false, is_require);
        //        const fileTransfer = new Transfer();
        //        var options: any;
        //        options = {
        //            fileKey: event.srcElement.files[0] ? event.srcElement.files[0].type : "",
        //            fileName: event.srcElement.files[0] ? event.srcElement.files[0].name : "",
        //            headers: {}
        //        }
        //        FileChooser.open()
        //            .then((uri) => {
        //                forEach(this.jsonFileData, (value) => {
        //                    if (value.option_id == opt.option_id) {
        //                        value.option_url = event.srcElement.files[0].name;
        //                        value.option_Price = opt.price;
        //                        value.file = opt;
        //                        value.options = options;
        //                        value.uri = uri;
        //                    }
        //                })
        //                forEach(this.jsonFileData, (value) => {
        //                    this.jsonFileDataValue[value.option_id] = value.option_url;
        //                    fileArray.push(value.file);
        //
        //                })
        //                let json = { "file": this.jsonFileData };
        //                this.fileSubData = json;
        //                this.bundleJson();
        //
        //            }, (err) => {
        //                console.log(err)
        //            });

    }
    timeChanged(formId, is_require) {
        let array = [];
        let time = {};
        let day_part;
        let hour = 0;
        this.formValidate(formId, false, is_require);
        this.timePrice = { "price": this.jsonTimeData.option_Price };
        array = this.time.split(':');
        if (array[0] * 1 > 12) {
            hour = (array[0] * 1) - 12;
            day_part = "pm";
        }
        else {
            hour = (array[0] * 1);
            day_part = "am";
        }
        time = {
            "hour": hour,
            "minute": (array[1] * 1),
            "day_part": day_part
        }
        this.timeJson[this.jsonTimeData.option_id] = time;
        this.timeSubData = { "time": time };
        this.bundleJson();
    }
    dateChanged(formId, is_require) {
        //        this.formValidate(formId, false, is_re        quire);
        //                
        //        var dateObj = new Date(this.dat        eData);
        //        var day = dateObj.get        Date();
        //        var months = dateObj.getM        onth();
        //        var year = dateObj.getFull        Year();
        //        this.datePrice = { "price": this.jsonDateData.option_P        rice };
        //        let dateJ        son = {
        //            "month": months *         1 + 1,
        //            "day        ": day,
        //            "year        ": year
        //                }
        //        this.dateJson[this.jsonDateData.option_id] = da        teJson;
        //        this.dateSubData = { "dateJson": date        Json };
        //        this.bundleJson();
        let dateJson; var dateObj; var day; var year; var months;
        forEach(this.custom_option, (value) => {
            if (value.type == 'date' && value.vertualId) {
                console.log(value.vertualId)
                dateObj = new Date(value.vertualId);
                day = dateObj.getDate();
                months = dateObj.getMonth();
                year = dateObj.getFullYear();
                dateJson = {
                    "month": months * 1 + 1,
                    "day": day,
                    "year": year
                }
                this.date[value.vertualId.option_id] = dateJson;// option_id is undefined
            }
        });
        console.log(this.date);
    }
    calenderChanged(formId, is_require) {
        var dateObj = new Date(this.month);
        var min = dateObj.getUTCMinutes();
        var hours = dateObj.getUTCHours();
        this.formValidate(formId, false, is_require);
        this.dateTimePrice = { "price": this.jsonDateTimeData.option_Price };
        var data = {
            "hour": hours,
            "minute": min,
            "day_part": "am"
        }
        this.datTimeeJson[this.jsonDateTimeData.option_id] = data;
        this.datTimeeSubData = { "dateTime": data };
        this.bundleJson();
    }
    checkVisiblety(obj) {
        if (obj.visable == false) {
            obj.visable = true;
        }
        else {
            obj.visable = false;
        }
    }
    formValidate(data, flag, is_require) {
        if (is_require == "0") {
            flag = false;
        }
        forEach(this.validateArray, (value, key) => {
            if (value.id == data) {
                value.validate = flag;
                return false;
            }
        })
    }
    bundleJson() {
        var total = 0;
        let jsonData = {};
        let subdata = [];

        let validateCount = 0;
        let custonCartDisable = true;
        if (this.textPrice.price != undefined) {
            total += (this.textPrice.price * 1);
        }
        if (this.textAreaPrice.price != undefined) {
            total += (this.textAreaPrice.price * 1);
        }
        if (this.datePrice != undefined) {
            total += (this.datePrice.price * 1);
        }
        if (this.timePrice != undefined) {
            total += (this.timePrice.price * 1);
        }
        if (this.dateTimePrice != undefined) {
            total += (this.dateTimePrice.price * 1);
        }
        forEach(this.radioSubdata, function(value: any) {
            forEach(value, function(radioValue: any) {
                console.log("radio Price", radioValue.price);
                total += (radioValue.price * 1);
            });
        });
        forEach(this.selectPrice, function(value: any) {
            total += (value.price * 1);
        });
        forEach(this.multiPrice, function(value: any) {
            forEach(value, function(data) {
                total += (data.price * 1);
            })
        });
        forEach(this.checkPrice, function(value: any) {
            total += (value.price * 1);
        });
        forEach(this.jsonFileData, function(value: any) {
            if (value != undefined) {
                total += (value.option_Price * 1);
            }
        });
        forEach(this.validateArray, (value, key: any) => {
            if (value.validate == false) {
                validateCount++;
            }
        })
        if (validateCount == this.validateArray.length) {
            custonCartDisable = false;
        }
        jsonData = merge(jsonData, this.jsonTimeData, this.datTimeeJson, this.textData, this.checkObj, this.textarea, this.selectObj, this.Radioobj, this.multiObj, this.jsonFileDataValue, this.timeJson, this.dateJson)
        subdata = merge(subdata, this.textSubdata, this.textAreaSubdata, this.selectSubdata, this.radioSubdata, this.multiSubdata, this.checkSubData, this.fileSubData, this.timeSubData, this.dateSubData, this.datTimeeSubData);
        jsonData = { "dynemicPrice": total, "custom": jsonData, "customSubdata": subdata, "disable": custonCartDisable }
        this.onChange.emit(jsonData);
    }
}