import {Component, Input, Output, EventEmitter} from '@angular/core';
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

    constructor() {}
    /** 
*    ngOnInit
* function use to set editable data into fileds
**/
    ngOnInit() {
        this.currencySign = this.data.body.data.currency_sign;
        forEach(this.data.body.links, (value: any, key) => {
            value.download = false;
            if (this.editCartData) {
                forEach(this.editCartData.links, (options: any) => {
                    if (options && options == value.link_id) {
                        value.download = true;
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
    /** 
*    onChangeLink
* function use  for onChangeLink event
**/
    onChangeLink() {
        this.linkData = [];
        forEach(this.links, (value: any, key) => {
            if (value.download) {
                this.linkData.push(value.link_id * 1);
            }
        })
        this.calculateTotal();
    }
          /* 
 *    onChangeSamle
 * function use  on click sample lnk
 **/
    onChangeSample(object, i, event) {
        if (event) {
            this.simpleObj.push(object)
        }
        else {
            this.simpleObj = pull(this.simpleObj, object);
        }
    }
    /** 
*    calculateTotal
* function use  for sub total 
**/
    calculateTotal() {
        var total = 0;
        let disable;
        let count = 0;
        forEach(this.links, (value: any, key) => {
            if (value.download) {
                count++;
                total = total + (parseFloat(value.price));
            }
        })
        if (count > 0) {
            disable = false;
        }
        else {
            disable = true;
        }
        this.linkData = {"links": this.linkData, "dynemicPrice": total, "disable": disable};
        this.onChange.emit(this.linkData);
    }
}




