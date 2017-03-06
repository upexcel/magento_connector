import { Component, Input, Output, EventEmitter } from '@angular/core';
import forEach from 'lodash/forEach';
import pull from 'lodash/pull';

@Component({
    selector: 'download',
    templateUrl: 'download.html'
})
export class DownloadProduct {
    @Input() data: any = "";
    @Input() editCartData: any = "";
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
        forEach(this.data.body.links, (value: any, key) => {
            value.download = false;
            if (this.editCartData) {
                forEach(this.editCartData.subdata, (subdata: any) => {
                    if (subdata && subdata.value.link_id == value.link_id) {
                        value.download = true;
                        console.log(subdata.value.download)
                    }
                });
            }
            this.links.push(value);
        })
        forEach(this.data.body.samples, (value: any, key) => {
            this.sample.push(value);
        })
        setTimeout(() => {
            this.onChangeLink();
        }, 100)

    }
    onChangeLink() {
        this.linkData = {};
        forEach(this.links, (value: any, key) => {
            if (value.download) {
                this.linkData[value.link_id] = value.link_file;
            }
        })
        console.log(this.linkData)
        this.calculateTotal();
    }
    onChangeSample(object, i, event) {
        if (event) {
            this.simpleObj.push(object)
        }
        else {
            this.simpleObj = pull(this.simpleObj, object);
        }
    }
    calculateTotal() {
        var total = 0;
        let download = {};
        let disable;
        let count = 0;
        forEach(this.links, (value: any, key) => {
            if (value.download) {
                count++;
                total = total + (value.price * 1);
                if (value != undefined) {
                    download[value.link_id] = { "key": value.title, "value": value };
                }
            }
        })
        if (count > 0) {
            disable = false;
        }
        else {
            disable = true;
        }
        console.log("download", download)
        this.linkData = { "options": this.linkData, "dynemicPrice": total, "disable": disable, "subdata": download };
        this.onChange.emit(this.linkData);
    }
}




