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
    constructor(private _fb: FormBuilder) { }
    ngOnInit() {
        var dateObj = new Date();
        this.curYear = dateObj.getFullYear();
        this.currencySign = this.data.body.data.currency_sign;
        let self = this;
        this.validateArray = [];
        this.price = this.data.body.data.final_price;
        this.custom_option = this.data.body.data.product_custom_option;
        forEach(this.custom_option, (value, key) => {
            value.id = key;
            value.visable = true;
            if (value.is_require == "1") {
                this.validateArray.push({ "id": value.id, "validate": true });
            } else {
                this.validateArray.push({ "id": value.id, "validate": false });
            }
            forEach(value.option_type, (data, id) => {
                data.disable = false;
                if (data.price_type == "percent") {
                    let interest = ((this.price * 1) * (data.price * 1)) / 100;
                    data.price = interest;
                    data.default_price = interest;
                }
            })
            self.keys.push(value.type);
            if (value.type == "date_time") {
                self.jsonDateTimeData = {
                    "option_id": value.option_type[0].option_id,
                    "option_Price": value.option_type[0].price
                }
            }
            if (value.type == "time") {
                self.jsonTimeData = {
                    "option_id": value.option_type[0].option_id,
                    "option_Price": value.option_type[0].price
                }
            }
            if (value.type == "date") {
                self.jsonDateData = {
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
                self.jsonFileData.push(obj);
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
        this.selectPrice = [];
        let option_id;
        let json: any = [];
        this.selectObj = {};
        let disable = false;
        let value: any = [];
        forEach(data, (data: any, key1) => {
            if (data) {
                data.disable = true;
                disable = data.disable;
                value.push(data);
                this.selectPrice.push({ "price": data.price, "disable": disable });
                this.formValidate(formId, false, is_require);
                option_id = data.option_id;
                json.push(data.option_type_id);
            }
        })
        this.selectObj[option_id] = json;
        let select = { "drop_down": value };
        this.selectSubdata = select;
        this.bundleJson();

    }
    onChangeRadio(formId, is_require) {
        this.Radioobj = {};
        let radio: any;
        let selectedRadioFiled: any = [];
        this.formValidate(formId, false, is_require);
        forEach(this.radio, (value, key) => {
            if (value) {
                this.Radioobj[value.option_id] = value.option_type_id;
                selectedRadioFiled.push(value);
            }
        });
        radio = { "radio": selectedRadioFiled }
        this.radioSubdata = selectedRadioFiled;
        this.bundleJson();

    }
    onChangeMulti(data, formId, i, is_require) {
        this.multiPrice = [];
        let self = this;
        let json: any = [];
        let option_id;
        this.multiObj = {};
        let dataRecord: any = [];
        let subRecord: any = [];
        let multiPrice: any = [];
        if (data[i].length > 0) {
            this.formValidate(formId, false, is_require);
        }
        else {
            this.formValidate(formId, true, is_require);
        }
        forEach(this.selectMulti, function(value) {
            forEach(value, function(data: any, key1) {
                if (data) {
                    subRecord.push(data);
                    multiPrice.push({ "price": data.price });
                    option_id = data.option_id;
                    json.push(data.option_type_id);
                }
            })
            if (value != undefined) {
                self.multiPrice.push(multiPrice);
                self.multiObj[option_id] = json;
                dataRecord.push(subRecord);
                json = [];
                multiPrice = [];
                subRecord = [];
            }
        })
        forEach(dataRecord)
        let multi = { "multiple": dataRecord };
        this.multiSubdata = multi;
        this.bundleJson();
    }
    onChangeCheck(data, event, formId, is_require) {
        let option_id;
        this.checkObj = {};
        this.checkPrice = [];
        if (event) {
            this.checkData.push(data);
        }
        else {
            this.checkData = pull(this.checkData, data);
        }
        if (this.checkData.length > 0) {
            this.formValidate(formId, false, is_require);
        } else {
            this.formValidate(formId, true, is_require);
        }
        forEach(this.checkData, (data: any, key1) => {
            if (!this.checkObj[data.option_id]) {
                this.checkObj[data.option_id] = [];
            }
            if (data) {
                this.checkPrice.push({ "price": data.price });
                option_id = data.option_id;
                this.checkObj[option_id].push(data.option_type_id);
            }
        })
        let ckeckBox = { "checkbox": this.checkData };
        this.checkSubData = ckeckBox;
        this.bundleJson();
    }
    file(event, opt, formId, is_require) {
        let self = this;
        let fileArray: any = [];
        this.formValidate(formId, false, is_require);
        //        const fileTransfer = new Transfer();
        var options: any;
        options = {
            fileKey: event.srcElement.files[0].type,
            fileName: event.srcElement.files[0].name,
            headers: {}
        }
        FileChooser.open()
            .then((uri) => {
                console.log(uri)
                forEach(this.jsonFileData, function(value) {
                    if (value.option_id == opt.option_id) {
                        value.option_url = event.srcElement.files[0].name;
                        value.option_Price = opt.price;
                        value.file = opt;
                        value.options=options;
                        value.uri=uri;
                    }
                })
                forEach(this.jsonFileData, (value)=> {
                    this.jsonFileDataValue[value.option_id] = value.option_url;
                    fileArray.push(value.file);

                })
                console.log(this.jsonFileData)
                let json = { "file": this.jsonFileData };
                self.fileSubData = json;
                this.bundleJson();
                
            })
            .catch(e => console.log(e));

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
        this.timeSubData = {"time": time};
        this.bundleJson();
    }
    dateChanged(formId, is_require) {
        this.formValidate(formId, false, is_require);
        var dateObj = new Date(this.dateData);
        var day = dateObj.getDate();
        var months = dateObj.getMonth();
        var year = dateObj.getFullYear();
        this.datePrice = { "price": this.jsonDateData.option_Price };
        let dateJson = {
            "month": months * 1 + 1,
            "day": day,
            "year": year
        }
        this.dateJson[this.jsonDateData.option_id] = dateJson;
        this.dateSubData = {"dateJson":dateJson};
        this.bundleJson();
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
        this.datTimeeSubData = {"dateTime":data};
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
        console.log("this.radioSubdata",this.radioSubdata);
        var total = 0;
        let jsonData = {};
        let subdata = {};

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
            total += (value.price * 1);
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