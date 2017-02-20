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
        let data = {};
        let newVal = 0;
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
        var opt = {};
        var id = {};
        forEach(this.grouped.group_associated_products, function(value, key) {
            id[value.product_id] = value.quantity;
            if (!opt[value.product_id]) {
                opt[value.product_id] = [];
            }
            opt[value.product_id].push(value);
        });
        let obj = { "option": id, "subData": opt }
        console.log(obj)
        this.sendData.emit(obj);
    }

}