import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import forEach from 'lodash/forEach';
import clone from 'lodash/clone';
import pull from 'lodash/pull';

@Component({
    selector: 'download',
    templateUrl: 'download.html'
})
export class DownloadProduct {
    @Input() data: any = "";
    @Output() onChange = new EventEmitter();
    links: any = [];
    sample: any = [];
    sampleData: any = [];
    linkData: any = [];
    obj: any = [];
    simpleObj: any = [];
    price: any = [];
    index: any = [];
    linkD: any = [];
    key: any;
    currencySign: string;

    constructor() { }
    ngOnInit() {
        this.currencySign = this.data.body.data.currency_sign;
        let self = this;
        forEach(this.data.body.links, function(value: any, key) {
            self.links.push(value);
        })
        forEach(this.data.body.samples, function(value: any, key) {
            self.sample.push(value)
        })
    }
    onChangeLink(object, i, event, link) {
        let self = this;
        this.price = [];
        if (event) {
            this.obj.push(object)
            this.linkD.push(link);
            this.index.push(i);
        }
        else {
            this.obj = pull(this.obj, object);
            this.linkD = pull(this.linkD, link);
            this.index = pull(this.index, i);
        }
        forEach(this.obj, function(value: any) {
            self.price.push({ "price": value.price });
        })
        this.calculateTotal();
    }
    onChangeSample(object, i, event) {
        let self = this;
        if (event) {
            this.simpleObj.push(object)
        }
        else {
            this.simpleObj = pull(this.simpleObj, object);
        }
    }
    calculateTotal() {
        var total = 0;
        let json = {};
        let disable;
        forEach(this.price, function(value: any) {
            total += (value.price * 1);
        });
        for (let i = 0; i < this.index.length; i++) {
            json[this.index[i]] = this.linkD[i];
        };
        if (this.obj.length > 0) {
            disable = false;
        }
        else {
            disable = true;
        }
        json = { "options": json, "dynemicPrice": total, "disable": disable, "sudata": this.obj };
        this.onChange.emit(json);
    }
}




