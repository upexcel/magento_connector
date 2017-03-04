import {Component, Input, Output, EventEmitter} from '@angular/core';
import forEach from 'lodash/forEach';
import merge from 'lodash/merge';
import {FileChooser} from 'ionic-native';

@Component({
    selector: 'custom',
    templateUrl: 'custom.html'
})
export class CustomOption {
    @Input() data: any = "";
    @Input() editCartData: any = "";
    @Output() onChange = new EventEmitter();
    currencySign: string;
    custom_option: any = [];
    textData: any = {};
    textarea: any = {};
    jsonFileData: any = [];
    jsonFileDataValue = {};
    selectObj: any = {};
    Radioobj: any = {};
    multiObj: any = {};
    checkObj: any = {};
    timeJson: any = {};
    curYear: any;
    validateArray: any = [];
    price: number;
    date: any;
    dateTimeJson: any;
    show;
    constructor() {}
    ngOnInit() {
        var dateObj = new Date();
        this.curYear = dateObj.getFullYear();
        this.currencySign = this.data.body.data.currency_sign;
        this.validateArray = [];
        this.price = this.data.body.data.final_price;
        this.custom_option = this.data.body.data.product_custom_option;
        forEach(this.custom_option, (value: any, key) => {
            value.id = key;
            value.visable = true;
            value.vertualArray = [];
            value.vertualId = false;
            value.date = false;
            value.text = "";

            if (!this.editCartData) {
                if (value.is_require == "1") {
                    this.validateArray.push({"id": value.id, "validate": true});
                } else {
                    this.validateArray.push({"id": value.id, "validate": false});
                }
            }
            forEach(value.option_type, (data) => {
                data.defaultSet = false;
                data.disable = false;
                if (data.price_type == "percent") {
                    let interest = ((this.price * 1) * (data.price * 1)) / 100;
                    data.price = interest;
                    data.default_price = interest;
                }
            })
            //            if (value.type == "file") {
            //                var obj = {
            //                    "option_id": value.option_type[0].option_id,
            //                    "option_url": "",
            //                    "option_Price": "",
            //                    "file": "",
            //                    "disable": "",
            //                    "options": "",
            //                    "uri": ""
            //                }
            //                this.jsonFileData.push(obj);
            //            }
            if (this.editCartData) {
                forEach(this.editCartData.customSubdata, (cartData) => {
                    if (value.type == 'checkbox') {
                        forEach(value.option_type, (opt) => {
                            if (cartData.value.defaultSet && cartData.value.option_type_id == opt.option_type_id) {
                                opt.defaultSet = true;
                            }
                        })
                        this.validateArray.push({"id": value.id, "validate": false});
                    }
                    if ((value.type == "drop_down" || value.type == 'radio')) {
                        forEach(value.option_type, (opt) => {
                            if (opt.option_type_id == cartData.value.option_type_id) {
                                if (cartData.id == value.id) {
                                    value.vertualId = opt;
                                }
                            }
                        })
                        this.validateArray.push({"id": value.id, "validate": false});
                    }
                    if (value.type == 'multiple') {
                        if (cartData.id == value.id) {
                            forEach(value.option_type, (opt) => {
                                if (opt.option_type_id == cartData.value.option_type_id) {
                                    value.vertualArray.push(opt);
                                }
                            })

                        }
                        this.validateArray.push({"id": value.id, "validate": false});
                    }

                    if (value.type == "date" || value.type == "time" || value.type == "date_time") {
                        if (cartData.id == value.id) {
                            value.vertualId = cartData.value;
                        }
                        this.validateArray.push({"id": value.id, "validate": false});
                    }
                    if (value.type == 'area' || value.type == 'field') {
                        if (cartData.id == value.id) {
                            value.text = cartData.value;
                        }
                        this.validateArray.push({"id": value.id, "validate": false});
                    }

                })
            }
        })
        if (this.custom_option) {
            this.show = true;
            setTimeout(() => {
                this.bundleJson();
            }, 100);
        }
    }
    text(opt, formId, is_require) {
        forEach(this.custom_option, (value) => {
            if (value.type == "field") {
                if (value.text.length > 0) {
                    this.formValidate(value.id, false, is_require);
                    value.vertualId = opt;
                    this.textData[value.vertualId.option_id] = value.text;
                } else {
                    this.formValidate(value.id, true, is_require);
                    if (value.vertualId.option_id) {
                        this.textData[value.vertualId.option_id] = "";
                    }
                    value.vertualId['price'] = 0;
                }
            }
        });
        this.bundleJson();
    }
    textArea(opt, formId, is_require) {
        forEach(this.custom_option, (value) => {
            if (value.type == "area") {
                if (value.text.length > 0) {
                    this.formValidate(value.id, false, is_require);
                    value.vertualId = opt;
                    this.textarea[value.vertualId.option_id] = value.text;
                } else {
                    this.formValidate(value.id, true, is_require);
                    if (value.vertualId.option_id) {
                        this.textarea[value.vertualId.option_id] = "";
                        value.vertualId['price'] = 0;
                    }
                }
            }
        });
        this.bundleJson();
    }
    onChangeSelect(data, formId, is_require) {
        this.selectObj = {};
        forEach(this.custom_option, (value) => {
            if (value.type == "drop_down" && value.vertualId) {
                this.selectObj[value.vertualId.option_id] = value.vertualId.option_type_id;
            }
        });
        this.formValidate(formId, false, is_require);
        this.bundleJson();
    }
    onChangeRadio(formId, is_require) {
        this.Radioobj = {};
        forEach(this.custom_option, (value) => {
            if (value.type == 'radio' && value.vertualId) {
                this.Radioobj[value.vertualId.option_id] = value.vertualId.option_type_id;
            }
        });
        this.formValidate(formId, false, is_require);
        this.bundleJson();
    }
    onChangeMulti(data, formId, i, is_require) {
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
        this.bundleJson();
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
        if (countCheck > 0) {
            this.formValidate(formId, false, is_require);
        }
        else {
            this.formValidate(formId, true, is_require);
        }
        this.bundleJson();
    }
    file(event, opt, formId, is_require) {
        let fileArray: any = [];
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
        this.bundleJson();
    }
    timeChanged(formId, is_require) {
        let array = [];
        let time = {};
        let day_part;
        let hour = 0;
        var dateObj;
        this.formValidate(formId, false, is_require);
        forEach(this.custom_option, (value) => {
            if (value.type == 'time' && value.vertualId) {
                dateObj = new Date(value.vertualId);
                array = value.vertualId.split(':');
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
                forEach(value, (optId, optKey) => {
                    if (typeof (optId) == "object" && optId.length > 0) {
                        forEach(optId, (id) => {
                            this.timeJson[id.option_id] = time;
                            value.date = id;
                        })
                    }
                })
            }
        });
        this.bundleJson();
    }
    dateChanged(formId, is_require) {
        this.date = {};
        let dateJson; var dateObj; var day; var year; var months;
        forEach(this.custom_option, (value) => {
            if (value.type == 'date' && value.vertualId) {
                dateObj = new Date(value.vertualId);
                day = dateObj.getDate();
                months = dateObj.getMonth();
                year = dateObj.getFullYear();
                dateJson = {
                    "month": months * 1 + 1,
                    "day": day,
                    "year": year
                }
                forEach(value, (optId, optKey) => {
                    if (typeof (optId) == "object" && optId.length > 0) {
                        forEach(optId, (id) => {
                            this.date[id.option_id] = dateJson;
                            value.date = id;
                        })
                    }
                })
            }
        });
        this.formValidate(formId, false, is_require);
        this.bundleJson();

    }
    calenderChanged(formId, is_require) {
        var data; var hours; var min; var dateObj;
        this.formValidate(formId, false, is_require);
        //        this.bundleJson();
        this.dateTimeJson = {};
        forEach(this.custom_option, (value) => {
            if (value.type == 'date_time' && value.vertualId) {
                dateObj = new Date(value.vertualId);
                data = {
                    "hour": dateObj.getUTCHours(),
                    "minute": dateObj.getUTCMinutes(),
                    "month": dateObj.getUTCMonth() * 1 + 1,
                    "day": dateObj.getUTCDate(),
                    "year": dateObj.getUTCFullYear()
                }
                forEach(value, (optId, optKey) => {
                    if (typeof (optId) == "object" && optId.length > 0) {
                        forEach(optId, (id) => {
                            this.dateTimeJson[id.option_id] = data;
                            value.date = id;
                        })
                    }
                })
            }
        });
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
        let subdata: any = [];
        let opt = {};
        let validateCount = 0;
        let custonCartDisable = true;
        forEach(this.custom_option, (value) => {
            if (value.type == 'checkbox') {
                forEach(value.option_type, (opt) => {
                    if (opt.defaultSet) {
                        total = total + (opt.price) * 1;
                        subdata.push({"key": value.title, 'value': opt, 'id': value.id, 'type': value.type})
                    }
                })
            }
            if ((value.type == "drop_down" || value.type == 'radio') && value.vertualId) {
                total = total + value.vertualId.price * 1;
                subdata.push({"key": value.title, 'value': value.vertualId, 'id': value.id, 'type': value.type})
            }
            if ((value.type == "date" || value.type == "time" || value.type == "date_time") && value.vertualId) {
                if (value.date) {
                    total = total + (value.date.price) * 1;
                    let date = new Date(value.vertualId);
                    subdata.push({"key": value.title, 'value': value.vertualId, 'dateFormate': date, 'id': value.id, 'type': value.type})
                }
            }
            if (value.type == 'multiple' && value.vertualArray) {
                forEach(value.vertualArray, (multiSelectValue, multiSelectKey) => {
                    total = total + multiSelectValue.price * 1;
                    subdata.push({"key": value.title, 'value': multiSelectValue, 'id': value.id, 'type': value.type});
                })
            }
            if ((value.type == 'area' || value.type == 'field') && value.vertualId) {
                total = total + value.vertualId.price * 1;
                subdata.push({"key": value.title, 'value': value.text, 'id': value.id, 'type': value.type})
            }
        })

        opt = merge(opt, this.textData, this.textarea, this.selectObj, this.Radioobj, this.checkObj, this.timeJson, this.date, this.dateTimeJson, this.multiObj)
        forEach(this.validateArray, (value) => {
            if (value.validate == false) {
                validateCount++;
            }
        })
        if (validateCount == this.validateArray.length) {
            custonCartDisable = false;
        }
        opt = {"dynemicPrice": total, "custom": opt, "customSubdata": subdata, "disable": custonCartDisable}
        this.onChange.emit(opt);
    }
}