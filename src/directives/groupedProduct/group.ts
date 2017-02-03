import { Component, Input, Output, EventEmitter } from '@angular/core';

import forEach from 'lodash/forEach';

@Component({
    selector: 'group',
    templateUrl: 'group.html'
})
export class group {
    @Input() grouped: any;
    @Output() sendData = new EventEmitter();
    public quantity: any = [];
    public opt: {}
    constructor() {
        let data = {};
        let newVal = 1;
        setTimeout(() => {
            this.quantityDefault();
            this.groupedData(newVal, data);
        }, 100);
    }

    changeQty(newVal, data) {
        this.groupedData(newVal, data);
    }
    quantityDefault() {
        for (let i = 0; i < this.grouped.group_associated_products.length; i++) {
            this.quantity[i] = 1;
        }
    }
    groupedData(newVal?, data?) {
        var opt = {};
        var qun;
        forEach(this.grouped.group_associated_products, function(value, key) {
            let productId = value['product_id'];
            if (data.product_id == value['product_id']) {
                if (!newVal) {
                    newVal = "0";
                }
                qun = newVal;

            } else {
                qun = "1"
            }

            opt[productId] = qun;

        });
        let obj = {
            //            qty: 1,
            productid: this.grouped.data.entity_id,
            options: opt
        }
        this.sendData.emit(obj);
    }

}