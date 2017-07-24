import {Component} from '@angular/core';
import {ViewController, NavController, NavParams} from 'ionic-angular';
import {MyAccount} from './../../model/myaccount/myaccount';
import {MyAccountAddressDataType} from './../../model/myaccount/myaccountData';
import {ToastService} from './../../providers/toast-service/toastService';
import {Events} from 'ionic-angular';

@Component({
    selector: 'popover',
    template: `
    <ion-list class="popover no-margin">
      <button ion-item (click)="editAccount()">Edit</button>
      <button ion-item *ngIf="!(default_shipping || default_billing)" (click)="deleteAccount()">Delete</button>
    </ion-list>
 `
})
export class AccountPopoverPage {
    myaccount: MyAccountAddressDataType;
    id: number;
    entity_id: number;
    accountCartLength: any;
    default_billing: number;
    default_shipping: number;
    constructor(public _events: Events, private _navParams: NavParams, private _toast: ToastService, public viewCtrl: ViewController, private _navCtrl: NavController, private _myaccount: MyAccount) {}
    ngOnInit() {
        if (this._navParams.data) {
            this.id = this._navParams.data.id;
            this.entity_id = this._navParams.data.entity_id;
            this.accountCartLength = this._navParams.data.accountCartLen;
            this.default_shipping = this._navParams.data.default_shipping;
            this.default_billing = this._navParams.data.default_billing;
        }
    }
    /*
     * use for edit user account (publish event)
     */
    editAccount() {
        this.close();
        this._events.publish('user:edit', {
            "data": {
                "title": "Edit Address",
                "id": this.id,
                "entity_id": this.entity_id
            }
        });
    }
    /*
     * use for delete user account
     */
    deleteAccount() {
        this.close();
        let data = {
            entity_id: this.entity_id
        };
        this.viewCtrl.dismiss();
        this._myaccount.deleteMyAddress(data).then((res) => {
            this._toast.toast("Deleted", 3000, "top");
            this._events.publish('user:deleted', true);
        }, (err) => {})
    }
    close() {
        this.viewCtrl.dismiss();
    }
}