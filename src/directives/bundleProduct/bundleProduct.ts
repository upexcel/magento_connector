import { Component, Input, Output, EventEmitter } from '@angular/core';
import forEach from 'lodash/forEach';
import merge from 'lodash/merge';

@Component({
    selector: 'bundle',
    templateUrl: 'bundle.html'
})
export class BundleProduct {
    @Input() bundle: any = "";
    @Output() onChange = new EventEmitter();
    @Output() onChangeData = new EventEmitter();
    @Input() valBundle: boolean;
    bundleCheckQty: any = {};
    bundleRadioQty: any = {};
    bundleMultiQty: any = {};
    bundleSelectedQty: any = {};
    bundleSelected: any = {};
    bundleMultiSelected: any = {};
    checkObj: any = {};
    validateArray: any = [];
    radioChecked: any = {};
    constructor() {
    }
    ngOnInit() {
        this.validateArray = [];
        let m_Flag = 0;
        let c_Flag = 0;
        let r_Flag = 0;
        let s_Flag = 0;
        forEach(this.bundle.bundle_items, (value, key) => {
            value.id = key;
            value.vertualId = false;
            value.visable = true;
            value.vertualArray = [];
            if (value.is_require == "1") {
                this.validateArray.push({ "id": value.id, "validate": true });
            } else {
                this.validateArray.push({ "id": value.id, "validate": false });
            }
            forEach(value.selection, (selection: any, selectionKey) => {
                if (selection.is_default == "1") {
                    selection.defaultSet = true;
                } else {
                    selection.defaultSet = false;
                }
                if (selection.defaultSet == true) {
                    m_Flag = 1;
                    value.vertualId = selection;
                    if (value.type == "multi") {
                        value.vertualArray.push(selection);
                        if (!this.bundleMultiSelected[selection.selection_id]) {
                            this.bundleMultiSelected[selection.selection_id] = [];
                            this.bundleMultiQty[selection.selection_id] = [];
                        }
                        this.bundleMultiSelected[selection.selection_id].push(selection.selection_product_id);
                        this.bundleMultiQty[selection.selection_id].push(selection.selection_qty);
                    }
                    if (value.type == 'checkbox') {
                        if (!this.checkObj[selection.selection_id]) {
                            this.checkObj[selection.selection_id] = [];
                            this.bundleCheckQty[selection.selection_id] = [];
                        }
                        this.checkObj[selection.selection_id].push(selection.selection_product_id);
                        this.bundleCheckQty[selection.selection_id].push(selection.selection_qty);
                    }
                    if (value.type == 'radio' && value.vertualId) {
                        this.radioChecked[value.vertualId.selection_id] = value.vertualId.selection_product_id;
                        this.bundleRadioQty[value.vertualId.selection_id] = value.vertualId.selection_qty;
                    }
                    if (value.type == 'select' && value.vertualId) {
                        this.bundleSelected[value.vertualId.selection_id] = value.vertualId.selection_product_id;
                        this.bundleSelectedQty[value.vertualId.selection_id] = value.vertualId.selection_qty;
                    }
                }
            })
            if (m_Flag == 1) {
                this.formValidate(value.id, false, value.is_require);
                m_Flag = 0;
            }
            if (c_Flag == 1) {
                this.formValidate(value.id, false, value.is_require);
                c_Flag = 0;
            }
            if (s_Flag == 1) {
                this.formValidate(value.id, false, value.is_require);
                s_Flag = 0;
            }
            if (r_Flag == 1) {
                this.formValidate(value.id, false, value.is_require);
                r_Flag = 0;
            }
        })
    }

    onChangeBundleSelect(bundleSelect, formId, is_require) {
        this.bundleSelected = {};
        this.bundleSelectedQty = {};
        forEach(this.bundle.bundle_items, (value) => {
            if (value.type == 'select' && value.vertualId) {
                this.bundleSelected[value.vertualId.selection_id] = value.vertualId.selection_product_id;
                this.bundleSelectedQty[value.vertualId.selection_id] = value.vertualId.selection_qty;
            }
        });
        this.formValidate(formId, false, is_require);
    }
    onChangeBundleMulti(bundleMulti, formId, i, is_require) {
        this.bundleMultiSelected = {};
        this.bundleMultiQty = {};
        forEach(this.bundle.bundle_items, (value) => {
            if (value.type == 'multi') {
                forEach(value.vertualArray, (multiSelectData) => {
                    if (!this.bundleMultiSelected[multiSelectData.selection_id]) {
                        this.bundleMultiSelected[multiSelectData.selection_id] = [];
                        this.bundleMultiQty[multiSelectData.selection_id] = [];
                    }
                    this.bundleMultiSelected[multiSelectData.selection_id].push(multiSelectData.selection_product_id);
                    this.bundleMultiQty[multiSelectData.selection_id].push(multiSelectData.selection_qty);
                });
            }
        });
        if (bundleMulti.length > 0) {
            this.formValidate(formId, false, is_require);
        }
        else {
            this.formValidate(formId, true, is_require);
        }
    }
    onChangeBundleCheck(selection, formId, is_require) {
        this.checkObj = {};
        this.bundleCheckQty = {};
        var countCheck = 0;
        forEach(selection, (value, key) => {
            if (value) {
                if (value.defaultSet == true) {
                    countCheck++;
                }
            }
        })

        forEach(this.bundle.bundle_items, (valueItems) => {
            if (valueItems.type == "checkbox") {
                forEach(valueItems.selection, (value) => {
                    if (value.defaultSet == true) {
                        if (!this.checkObj[value.selection_id]) {
                            this.checkObj[value.selection_id] = [];
                            this.bundleCheckQty[value.selection_id] = [];
                        }
                        this.checkObj[value.selection_id].push(value.selection_product_id);
                        this.bundleCheckQty[value.selection_id].push(value.selection_qty);
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
    }

    onChangeRadio(selection, formId, is_require) {
        this.radioChecked = {};
        this.bundleRadioQty = {};
        forEach(this.bundle.bundle_items, (value) => {
            if (value.type == 'radio' && value.vertualId) {
                this.radioChecked[value.vertualId.selection_id] = value.vertualId.selection_product_id;
                this.bundleRadioQty[value.vertualId.selection_id] = value.vertualId.selection_qty;
            }
        });
        this.formValidate(formId, false, is_require);
    }
    calculateTotal(obj) {
        let total = 0;
        forEach(this.bundle.bundle_items, (value) => {
            if ((value.type == 'radio' || value.type == 'select') && value.vertualId) {
                total += ((value.vertualId.selection_qty * 1) * (value.vertualId.selection_price * 1));
            }
            if (value.type == "multi") {
                forEach(value.vertualArray, (multiValue1) => {
                    total += ((multiValue1.selection_qty * 1) * (multiValue1.selection_price * 1));
                })
            }
            if (value.type == "checkbox") {
                forEach(value.selection, (checkboxValue1) => {
                    if (checkboxValue1.defaultSet == true) {
                        total += ((checkboxValue1.selection_qty * 1) * (checkboxValue1.selection_price * 1));
                    }
                })
            }
        })
        obj["total"] = total;
        //        this.onChange.emit(total);
        this.bundleData(obj);
    }
    formValidate(data, flag, is_require) {
        let validateCount = 0;
        let obj;
        if (is_require == "0") {
            flag = false;
        }
        forEach(this.validateArray, (value, key) => {
            if (value.id == data) {
                value.validate = flag;
                return false;
            }
        })
        forEach(this.validateArray, (value) => {
            if (value.validate == false) {
                validateCount++;
            }
        })
        if (validateCount == this.validateArray.length) {
            obj = { "disable": false };
        } else {
            obj = { "disable": true };
        }
        this.calculateTotal(obj);

    }
    checkVisiblety(obj) {
        if (obj.visable == false) {
            obj.visable = true;
        }
        else {
            obj.visable = false;
        }
    }
    bundleData(obj?) {
        let data = {};
        let bundleDataToBeEmit = {};
        let bundle_option_qty = {};
        bundle_option_qty = merge(bundle_option_qty, this.bundleCheckQty, this.bundleRadioQty, this.bundleSelectedQty);
        data = merge(data, this.radioChecked, this.checkObj, this.bundleSelected, this.bundleMultiSelected);
        let bundle = [];
        forEach(this.bundle.bundle_items, (value) => {
            if ((value.type == 'radio' || value.type == 'select') && value.vertualId) {
                if (!bundle[value.id]) {
                    bundle[value.id] = [];
                }
                bundle[value.id].push(value.vertualId);
            }
            if (value.type == "multi") {
                if (!bundle[value.id]) {
                    bundle[value.id] = [];
                }
                forEach(value.vertualArray, (multiValue1) => {
                    bundle[value.id].push(multiValue1);
                })
            }
            if (value.type == "checkbox") {
                if (!bundle[value.id]) {
                    bundle[value.id] = [];
                }
                forEach(value.selection, (checkboxValue1) => {
                    if (checkboxValue1.defaultSet == true) {
                        bundle[value.id].push(checkboxValue1);
                    }
                })
            }
        })
        bundleDataToBeEmit = { "bundle_option_qty": bundle_option_qty, "option": data, "subData": bundle, "disable": obj.disable, "total": obj.total };
        setTimeout(() => {
            this.onChangeData.emit(bundleDataToBeEmit);
        }, 100);
    }
}
