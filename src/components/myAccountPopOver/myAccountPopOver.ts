import {
    Component,
    ViewChild,
    OnInit
} from '@angular/core';
import {
    ViewController,
    NavController,
    Nav,
    NavParams
} from 'ionic-angular';
import {
    MyAccount
} from './../../model/myaccount/myaccount';
import {
    MyAccountAddressDataType
} from './../../model/myaccount/myaccountData';
import {
    MyEditAccountPage
} from './../../pages/myaccount/myeditaccount';
import {
    ToastService
} from './../../providers/toast-service/toastService';
import {
    AppDataConfigService
} from './../../providers/appdataconfig/appdataconfig';
import {
    Events
} from 'ionic-angular';

@Component({
    template: `
    <ion-list>
      <button ion-item (click)="editAccount()">Edit</button>
      <button ion-item (click)="deleteAccount()">Delete</button>
    </ion-list>
 `
})
export class AccountPopoverPage {
    myaccount: MyAccountAddressDataType;
    secret: string;
    id: number;
    entity_id: number;
    constructor(public _events: Events, private _navParams: NavParams, private _appConfigService: AppDataConfigService, private _toast: ToastService, public viewCtrl: ViewController, private _navCtrl: NavController, private _myaccount: MyAccount) {}
    ngOnInit() {
        this._appConfigService.getUserData().then((userData: any) => {
            this.secret = userData.secret;
        });
        if (this._navParams.data) {
            this.id = this._navParams.data.id;
            this.entity_id = this._navParams.data.entity_id;
            console.log(this._navParams.data)
            console.log(this.id);
            console.log(this.entity_id);
        }
    }
    editAccount() {
        this._navCtrl.push(MyEditAccountPage, {
            "title": "Edit Address",
            "id": this.id,
            "entity_id": this.entity_id
        })
    }
    deleteAccount() {
        let data = {
            entity_id: this.entity_id,
            secret: this.secret
        };
        this.viewCtrl.dismiss();
        this._myaccount.deleteMyAddress(data).then((res) => { 
                this._toast.toast("Deleted", 3000, "top");
                this._events.publish('user:deleted', true);
            })
            .catch((err) => {})
    }
    close() {
        this.viewCtrl.dismiss();
    }
}