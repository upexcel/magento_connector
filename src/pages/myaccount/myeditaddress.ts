import {
    Component,
    OnInit
} from '@angular/core';
import {
    NavController,
    PopoverController,
    NavParams,
    Events
} from 'ionic-angular';
import {
    PopoverPage
} from './../../components/popover/popover';
import {
    FormBuilder, Validators
} from '@angular/forms';
import {
    MyAccount
} from './../../model/myaccount/myaccount';
import {
    Edit
} from './../../model/myaccount/editAccount';
import {
    MyAccountAddressDataType
} from './../../model/myaccount/myaccountData';
import {
    EditAccountDataType
} from './../../model/myaccount/editAccountData';

import {
    ToastService
} from './../../providers/toast-service/toastService';
import {
    AppDataConfigService
} from './../../providers/appdataconfig/appdataconfig';
import {
    Country
} from './../../model/myaccount/country';
import {
    ViewController
} from 'ionic-angular';
import { MySavedAddressPage } from './../myaccount/savedAddress';
@Component({
    selector: 'edit-address',
    templateUrl: 'myeditaddress.html'
})
export class MyEditAddressPage implements OnInit {
    myaccount: MyAccountAddressDataType;
    editaccount: EditAccountDataType;
    spin: boolean;
    updateform: any;
    upd_spin: boolean = false;
    title: string;
    id: any;
    entity_id: any;
    message: string = "Token expired";
    counrtyName: object;
    default_billing: any = 0;
    default_shipping: any = 0;
    reverseCartData: Array<any>;
    firstTime = 0;
    checkBilling = 0;
    checkShipping = 0;
    constructor(public viewCtrl: ViewController, private _country: Country, private _appConfigService: AppDataConfigService, private _toast: ToastService, private _events: Events, private _myaccount: MyAccount, private _edit: Edit, private _navParams: NavParams, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _fb: FormBuilder) { }
    ngOnInit() {
        this.title = this._navParams.get("title");
        this.id = this._navParams.get("id");
        this.firstTime = this._navParams.get("firstTime");
        this.entity_id = this._navParams.get("entity_id");
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData.access_token != null) {
                this.getuser_details(this.id, this.entity_id, userData.firstname, userData.lastname);
            } else { }
        });
        this._country.getCountryName().then((name) => {
            this.counrtyName = name;
        })

    }
    root() {
        this._navCtrl.push(MySavedAddressPage).then(() => {
            const index = this.viewCtrl.index;
            this._navCtrl.remove(index);
        });
    }
    getuser_details(id, entity_id, firstname?, lastname?) {
        this.spin = true;
        if (entity_id != null) {
            this._myaccount.getMyAccount({}).then((res) => {
                this.myaccount = res;
                this.reverseCartData = (this.myaccount.body);
                this.spin = false;
                if (this.myaccount.body.length != 0 && entity_id != null) {
                    let d_billing;
                    let d_shipping;
                    this.checkBilling = this.reverseCartData[id].default_billing;
                    this.checkShipping = this.reverseCartData[id].default_shipping;
                    //                    if(this.reverseCartData[id].default_shipping)
                    this.updateform = this._fb.group({
                        firstname: [this.reverseCartData[id].firstname, Validators.required],
                        lastname: [this.reverseCartData[id].lastname, Validators.required],
                        city: [this.reverseCartData[id].city, Validators.required],
                        company: [this.reverseCartData[id].company],
                        telephone: [this.reverseCartData[id].telephone, Validators.required],
                        fax: [this.reverseCartData[id].fax],
                        street: [this.reverseCartData[id].street, Validators.required],
                        zip: [this.reverseCartData[id].postcode, Validators.required],
                        countryid: [this.reverseCartData[id].country_id, Validators.required],
                        default_billing: [this.reverseCartData[id].default_billing],
                        default_shipping: [this.reverseCartData[id].default_shipping],
                        entity_id: [entity_id]
                    })
                }
            })
                .catch(err => { })
        } else {
            this.spin = false;
            if (this.firstTime) {
                this.updateform = this._fb.group({
                    firstname: [firstname, Validators.required],
                    lastname: [lastname, Validators.required],
                    city: ['', Validators.required],
                    company: [''],
                    telephone: ['', Validators.required],
                    fax: [''],
                    street: ['', Validators.required],
                    zip: ['', Validators.required],
                    countryid: ['', Validators.required],
                    default_billing: [1],
                    default_shipping: [1],
                    entity_id: ['']
                })
            } else {
                this.updateform = this._fb.group({
                    firstname: [firstname, Validators.required],
                    lastname: [lastname, Validators.required],
                    city: ['', Validators.required],
                    company: [''],
                    telephone: ['', Validators.required],
                    fax: [''],
                    street: ['', Validators.required],
                    zip: ['', Validators.required],
                    countryid: ['', Validators.required],
                    default_billing: [0],
                    default_shipping: [0],
                    entity_id: ['']
                })
            }
        }
    }
    update(value: any) {
        if (value.default_billing) {
            value.default_billing = '1';
        }
        else {
            value.default_billing = '0';
        }
        if (value.default_shipping) {
            value.default_shipping = '1';
        }
        else {
            value.default_shipping = '0';
        }
        this.upd_spin = true;
        this._edit.updateAddress(value).then((res) => {
            this.upd_spin = false;
            this.editaccount = res;
            if (this.editaccount.status === 1) {
                this._events.publish('api:savedaddress', true);
                //                this.viewCtrl.dismiss();
                this._navCtrl.push(MySavedAddressPage, { 'saveAdd': true }).then(() => {
                    const index = this.viewCtrl.index;
                    this._navCtrl.remove(index);
                });
            } else {
                this._toast.toast(JSON.parse(this.editaccount.message).error, 3000, "top");
            }
        })
            .catch(err => {
                this.upd_spin = false;
            });
    }
    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }

}