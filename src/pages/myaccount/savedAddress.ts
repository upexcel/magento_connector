import {
    Component,
    OnInit
} from '@angular/core';
import {
    NavController,
    PopoverController,
    Events,
    NavParams,
    ViewController
} from 'ionic-angular';
import {
    PopoverPage
} from './../../components/popover/popover';
import {
    MyEditAddressPage
} from './myeditaddress';
import {
    MyAccount
} from './../../model/myaccount/myaccount';
import {
    MyAccountAddressDataType
} from './../../model/myaccount/myaccountData';
import {
    AppDataConfigService
} from './../../providers/appdataconfig/appdataconfig';
import {
    LoginPage
} from './../../pages/login/login';
import {
    Edit
} from './../../model/myaccount/editAccount';
import {
    AccountPopoverPage
} from './../../components/myAccountPopOver/myAccountPopOver';
import { Address } from './../../providers/address-service/address';
import forEach from 'lodash/forEach';
import debounce from 'lodash/debounce';

@Component({
    selector: 'saved-address',
    templateUrl: 'savedAddress.html'
})
export class MySavedAddressPage implements OnInit {
    myaccount: MyAccountAddressDataType;
    spin: boolean;
    error: boolean = false;
    addAddr: boolean = false;
    showAddress: boolean;
    reverseCartData: any;
    disable: boolean = false;
    message: string = "Token expired";
    alreadyCheckLength: boolean;
    saveAdd: boolean;
    constructor(private viewCtrl: ViewController, private _address: Address, private _navParam: NavParams, private _appConfigService: AppDataConfigService, private _editaccount: Edit, private _events: Events, private _myaccount: MyAccount, private _navCtrl: NavController, private _popoverCtrl: PopoverController) {
        this.alreadyCheckLength = this._navParam.get('alreadyCheckLength');
        this.saveAdd = this._navParam.get('saveAdd');
        this._events.subscribe('api:savedaddress', (savedaddress) => {
            if (savedaddress) {
                this.getInitAdd(savedaddress);
            }
        });
        this._events.subscribe('user:deleted', (deleted) => {
            if (deleted) {
                this.getInitAdd(deleted);
            }

        });
        this._events.subscribe('user:edit', (edit) => {
            if (edit) {
                this._navCtrl.push(MyEditAddressPage, edit.data).then(() => {
                    const index = this.viewCtrl.index;
                    this._navCtrl.remove(index);
                    this._events.unsubscribe('user:edit');
                });

            }
        });
    }
    ngOnDestroy() {
        this._events.unsubscribe('user:edit');
        this._events.unsubscribe('user:deleted');
        this._events.unsubscribe('api:savedaddress');
    }
    ngOnInit() {
        if (this.saveAdd) {
            this.getInitAdd(true);
        } else {
            this.getInitAdd();
        }
    }
    getInitAdd(eventData?) {
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData.access_token != null) {
                this.getuser_details(eventData);
            } else {
                this._navCtrl.push(LoginPage);
            }
        })
            .catch((err) => { })
    }

    getuser_details(eventData) {
        this.spin = true;
        let entity_id = null;
        this._address.getAddress().then((address: any) => {
            if (address && address['body'].length > 0 && !eventData) {
                this.myaccount = address;
                this.spin = false;
                this.reverseData(entity_id);
            } else {
                this._myaccount.getMyAccount({}).then((res) => {
                    this.spin = false;
                    this._address.resetAddress();
                    this._address.setAddress(res);
                    this.myaccount = (res);
                    this.reverseData(entity_id);
                })
                    .catch(err => {
                        this.error = true;
                    })
            }
        }).catch(err => {
            this.error = true;
        })
    }

    reverseData(entity_id?) {
        if (this.myaccount && this.myaccount.body.length != 0) {
            this.showAddress = true;
            forEach(this.myaccount.body, (value, key) => {
                value['id'] = key;
                if (!value.default_shipping) {
                    value['add_shipping'] = false;
                } else {
                    value['add_shipping'] = true;
                }
                if (!value.default_billing) {
                    value['add_billing'] = false;
                } else {
                    value['add_billing'] = true;
                }
            })
            this.reverseCartData = (this.myaccount.body);
        } else {
            this.showAddress = false;
            if (this.myaccount && this.myaccount.body.length != 0) {
                this._navCtrl.push(MyEditAddressPage, {
                    "title": "Add New Address",
                    "entity_id": entity_id,
                    "firstTime": 0
                }).then(() => {
                    const index = this.viewCtrl.index;
                    this._navCtrl.remove(index);
                });
            } else {
                this._navCtrl.push(MyEditAddressPage, {
                    "title": "Add New Address",
                    "entity_id": entity_id,
                    "firstTime": 1
                }).then(() => {
                    const index = this.viewCtrl.index;
                    this._navCtrl.remove(index);
                });
            }
        }
    }
    updateAdd(addressChange, change) {
        this.disable = true;
        let address = addressChange;
        forEach(this.reverseCartData, (value, key) => {
            if (change == 'default_shipping') {
                if (address.id != value.id) {
                    value.add_shipping = false;
                } else {
                    value.add_shipping = true;
                }
            } else {
                if (address.id != value.id) {
                    value.add_billing = false;
                } else {
                    value.add_billing = true;
                }
            }
        })
        address['zip'] = address.postcode;
        address['countryid'] = address.country_id;
        address['default_billing'] = '0';
        address['default_shipping'] = '0';
        if (address.add_billing) {
            address['default_billing'] = '1';
        }
        if (address.add_shipping) {
            address['default_shipping'] = '1';
        }
        this._editaccount.updateAddress(address).then((res) => {
            this.getInitAdd(true);
            this.disable = false;
        })
    }
    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
    AccountPopoverPage(myEvent: any, id, entity_id, addressData) {
        let data = { id: id, entity_id: entity_id, accountCartLen: this.myaccount.body, default_shipping: addressData.default_shipping, default_billing: addressData.default_billing }
        let popover = this._popoverCtrl.create(AccountPopoverPage, data);
        popover.present({
            ev: myEvent,
        });
    }
    doRefresh(refresher) {
        this.getInitAdd(true);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    addNewAddress() {
        this.addAddr = true;
        setTimeout(() => {
            this.addAddr = false;
        }, 1000);
        let entity_id = null;
        this._navCtrl.push(MyEditAddressPage, {
            "title": "Add New Address",
            "entity_id": entity_id
        }).then(() => {
            const index = this.viewCtrl.index;
            this._navCtrl.remove(index);
        });
    }
}