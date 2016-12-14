import { Component, Attribute, Input, Output, EventEmitter, OnInit } from '@angular/core';
import forEach from 'lodash/forEach';
import clone from 'lodash/clone';
import pull from 'lodash/pull';
import merge from 'lodash/merge';
import find from 'lodash/find';

@Component({
    selector: 'virtual',
    templateUrl: 'virtual.html'
})
export class VirtualProduct {
    @Input() data: any = "";
    @Output() onChange = new EventEmitter();
    virtualData: any = [];
    month: any;
    textData: any = {};
    textarea: any = {};
    textAreaPrice: any = {};
    selectMulti: any = [];
    select: any = [];
    radio: any;
    checkData: any = [];
    check: any = [];
    fileData: any = {};
    time: any;
    multiPrice: any = [];
    selectPrice: any = [];
    checkPrice: any = [];
    radioPrice: any = {};
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
    constructor( @Attribute("format") format) { }
    ngOnInit() {
        var _dateString = new Date();
        var day = _dateString.getDate();
        var months = _dateString.getMonth();
        var year = _dateString.getFullYear();
        var min = _dateString.getMinutes();
        var hours = _dateString.getHours();
        var string = year + '-' + months + '-' + day;
        this.time = hours + ':' + min;
        this.month = string;
        let self = this;
        this.virtualData = this.data.body.data.product_custom_option;
        forEach(this.virtualData, function(value, key) {
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
                    "file": ""
                }
                self.jsonFileData.push(obj);
            }
        })
    }
    text(opt) {
        this.textPrice = { "price": opt.price };
        if (this.textData != "") {
            this.textSubdata = { "text": opt };
        }
        this.bundleJson();
    }
    textArea(opt) {
        this.textAreaPrice = { "price": opt.price };
        if (this.textarea != "") {
            this.textAreaSubdata = { "textArea": opt };
        }
        this.bundleJson();
    }
    onChangeSelect(data) {
        this.selectPrice = [];
        let option_id;
        let self = this;
        let json: any = [];
        this.selectObj = {};
        let value: any;
        forEach(data, function(data: any, key1) {
            if (data) {
                value = data;
                self.selectPrice.push({ "price": data.price });
                option_id = data.option_id;
                json.push(data.option_type_id);
            }
        })
        this.selectObj[option_id] = json;
        let select = { "select": value };
        this.selectSubdata = select;
        this.bundleJson();

    }
    onChangeRadio(data) {
        this.Radioobj = {};
        let radio: any;
        this.radioPrice = { "price": this.radio.price };
        this.Radioobj[this.radio.option_id] = this.radio.option_type_id;
        radio = { "radio": this.radio }
        this.radioSubdata = radio;
        this.bundleJson();

    }
    onChangeMulti(data) {
        this.multiPrice = [];
        let self = this;
        let json: any = [];
        let option_id;
        this.multiObj = {};
        let valueData: any = [];
        forEach(this.selectMulti, function(value, key) {
            forEach(value, function(data: any, key1) {
                if (data) {
                    valueData.push(data);
                    self.multiPrice.push({ "price": data.price });
                    option_id = data.option_id;
                    json.push(data.option_type_id);
                }
            })
        })
        this.multiObj[option_id] = json;
        let multi = { "multiSelect": valueData };
        this.multiSubdata = multi;
        this.bundleJson();
    }
    onChangeCheck(data, event) {
        let self = this;
        let json: any = [];
        let option_id;
        this.checkObj = {};
        this.checkPrice = [];
        if (event) {
            this.checkData.push(data)
        }
        else {
            this.checkData = pull(this.checkData, data);
        }
        forEach(this.checkData, function(data: any, key1) {
            if (data) {
                self.checkPrice.push({ "price": data.price });
                option_id = data.option_id;
                json.push(data.option_type_id);
            }
        })
        this.checkObj[option_id] = json;
        let ckeckBox = { "ckeckBox": this.checkData };
        this.checkSubData = ckeckBox;
        this.bundleJson();
    }
    file(event, opt) {
        let self = this;
        let fileArray: any = [];
        forEach(this.jsonFileData, function(value) {
            if (value.option_id == opt.option_id) {
                value.option_url = event.srcElement.files[0].name;
                value.option_Price = opt.price;
                value.file = opt;
            }
        })

        forEach(this.jsonFileData, function(value) {
            self.jsonFileDataValue[value.option_id] = value.option_url;
            fileArray.push(value.file);
            var option = { "file": fileArray };
        })
        let json = { "file": this.jsonFileData };
        self.fileSubData = json;
        this.bundleJson();
    }

    timeChanged() {
        let array = [];
        let time = {};
        let day_part;
        let hour = 0;
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
        this.bundleJson();
    }
    dateChanged() {
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
        this.bundleJson();
    }
    calenderChanged() {
        var dateObj = new Date(this.month);
        var day = dateObj.getDate();
        var months = dateObj.getMonth();
        var year = dateObj.getFullYear();
        var min = dateObj.getUTCMinutes();
        var hours = dateObj.getUTCHours();
        this.dateTimePrice = { "price": this.jsonDateTimeData.option_Price };
        var data = {
            "hour": hours,
            "minute": min,
            "day_part": "am"
        }
        this.datTimeeJson[this.jsonDateTimeData.option_id] = data;
        this.bundleJson();
    }
    bundleJson() {
        var total = 0;
        let jsonData = {};
        let subdata = {};
        if (this.textPrice.price != undefined) {
            total += (this.textPrice.price * 1);
        }
        if (this.radioPrice.price != undefined) {
            total += (this.radioPrice.price * 1);
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
        forEach(this.selectPrice, function(value: any) {
            total += (value.price * 1);
        });
        forEach(this.multiPrice, function(value: any) {
            total += (value.price * 1);
        });
        forEach(this.checkPrice, function(value: any) {
            total += (value.price * 1);
        });
        forEach(this.jsonFileData, function(value: any) {
            if (value.option_Price) {
                total += (value.option_Price * 1);
            }
        });
        jsonData = merge(jsonData, this.jsonTimeData, this.datTimeeJson, this.textData, this.checkObj, this.textarea, this.selectObj, this.Radioobj, this.multiObj, this.jsonFileDataValue, this.timeJson, this.dateJson, this.bundleJson)
        subdata = merge(subdata, this.textSubdata, this.textAreaSubdata, this.selectSubdata, this.radioSubdata, this.multiSubdata, this.checkSubData, this.fileSubData);
        jsonData = { "dynemicPrice": total, "option": jsonData, "sudata": subdata }
        this.onChange.emit(jsonData);
    }
}




