import { Component, Input, Output, EventEmitter } from '@angular/core';
import forEach from 'lodash/forEach';

@Component({
    selector: 'group',
    templateUrl: 'group.html'
})
export class group {
    @Input() grouped: any;
    @Output() sendData = new EventEmitter();
    public opt: {}
    constructor() {
        setTimeout(() => {
            this.quantityDefault();
            this.groupedData();
        }, 100);
    }

    quantityDefault() {
        for (let i = 0; i < this.grouped.group_associated_products.length; i++) {
            this.grouped.group_associated_products[i]['quantity'] = 0;
        }
    }
    groupedData() {
        let opt = [], id = {}, total = 0, flag = 0;
        forEach(this.grouped.group_associated_products, function(value, key) {
            id[value.product_id] = value.quantity;

            if (value.quantity * 1 !== 0) {
                if (!opt[value.product_id]) {
                    opt[value.product_id] = [];
                }
                opt[value.product_id].push(value);
                flag = 1;
                total = total + (value.quantity * 1) * (value.final_price * 1);
            }
        });
        let obj = { "option": id, "subData": opt, "disable": (flag > 0) ? false : true, "total": total };
        console.log(obj)
        this.sendData.emit(obj);
    }

}