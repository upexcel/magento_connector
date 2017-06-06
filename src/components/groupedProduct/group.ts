import { Component, Input, Output, EventEmitter } from '@angular/core';
import forEach from 'lodash/forEach';

@Component({
    selector: 'group',
    templateUrl: 'group.html'
})
export class group {
    @Input() grouped: any;
    @Input() editCartData: any;
    @Output() sendData = new EventEmitter();
    public opt: {}
    constructor() {
        setTimeout(() => {
            if (this.editCartData) {
                this.quantityEdit();
            } else {
                this.quantityDefault();
                this.groupedData();
            }
        }, 100);
    }

    quantityEdit() {
        forEach(this.editCartData.super_attribute, (editCartOptionValue, editCartOptionkey) => {
            forEach(this.grouped.group_associated_products, (groupAssociatedProducsValue, key) => {
                if (editCartOptionkey == groupAssociatedProducsValue.product_id) {
                    groupAssociatedProducsValue.quantity = editCartOptionValue;
                }
            });
        });
        this.groupedData();
    }
    quantityDefault() {
        for (let i = 0; i < this.grouped.group_associated_products.length; i++) {
            // this.grouped.group_associated_products[i]['quantity'] = 0;
        }
    }
    groupedData() {
        let opt: any = [], id = {}, total = 0, flag = 0;
        forEach(this.grouped.group_associated_products, (value, key) => {
            id[value.product_id] = value.quantity;
            if (value.quantity && value.quantity * 1 !== 0) {
                opt.push(value);
                flag = 1;
                total = total + (value.quantity * 1) * (parseFloat(value.final_price));
            }
        });
        let obj = { "super_attribute": id, "subData": opt, "disable": (flag > 0) ? false : true, "total": total };
        this.sendData.emit(obj);
    }

}