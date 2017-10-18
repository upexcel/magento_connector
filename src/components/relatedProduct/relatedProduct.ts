import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import forEach from 'lodash/forEach';
import {CategoryProductPage} from '../../pages/categoryProduct/categoryProduct';
import {NavController} from 'ionic-angular';

@Component({
    selector: 'related-product',
    templateUrl: 'relatedProduct.html'
})
export class RelatedProduct {
    @Input() relatedData: any = "";
    @Input() content: any = "";
    @Output() onSelect = new EventEmitter();
    constructor(private _navCtrl: NavController, private sanitized: DomSanitizer) {

    }
    ngOnInit() {
        this.bundlePrice();
    }
    bundlePrice() {
        forEach(this.relatedData.body, (value) => {
            if (value.data.type == "bundle") {
                if (value.data.special_price && value.data.special_price.length > 0) {
                    let maxRPrice = (value.data.maxBPrice * value.data.special_price) / 100;
                    let minRPrice = (value.data.minBPrice * value.data.special_price) / 100;
                    value.data['displayBundlePrice'] = `From <b>${value.data.currency_sign}${minRPrice}</b> <span class="fontColor">Regular Price ${value.data.currency_sign}${value.data['minBPrice']} </span><br/> To <b>${value.data.currency_sign}${maxRPrice}</b>  <span class="fontColor">Regular Price ${value.data.currency_sign}${value.data['maxBPrice']} </span>`
                } else {
                    value.data['displayBundlePrice'] = `From ${value.data.currency_sign}${value.data['minBPrice']} <br/> To  ${value.data.currency_sign}${value.data['maxBPrice']} `
                }
            }
        });
        console.log(this.relatedData.body)
    }
    transformPrice(value) {
        return this.sanitized.bypassSecurityTrustHtml(value['displayBundlePrice']);
    }
    gotoCategoryProductPage(relatedData) {
        console.log("relatedData",relatedData)
        this._navCtrl.push(CategoryProductPage,{relatedData:relatedData,name:'Similar products',product_count:0})
    }
    showData(rel) {
        console.log(rel)
        this.content.scrollToTop(2000);
        let body={};
        body['body']=rel
        this.onSelect.emit(body);
    }
}
