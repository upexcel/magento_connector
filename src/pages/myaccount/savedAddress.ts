import {
    Component,
    OnInit
} from '@angular/core';
import {
    NavController,
    PopoverController,
    Events
} from 'ionic-angular';
import {
    ToastService
} from './../../providers/toast-service/toastService';
import {
    PopoverPage
} from './../../components/popover/popover';

import {
    Storage
} from '@ionic/storage';

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
    LogoutService
} from './../../providers/logout/logout-service';
import {
    LoginPage
} from './../../pages/login/login';
import {
    EditAccount
} from './../../model/myaccount/editAccount';
import {
    AccountPopoverPage
} from './../../components/myAccountPopOver/myAccountPopOver';
import { Address } from './../../providers/address-service/address';
import reverse from 'lodash/reverse';
import forEach from 'lodash/forEach';
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
    secret: string;
    reverseCartData: any;
    disable: boolean = false;
    message: string = "Token expired";
    constructor(private _address: Address, private _appConfigService: AppDataConfigService, private _editaccount: EditAccount, private _logout: LogoutService, private _toast: ToastService, private _events: Events, private _myaccount: MyAccount, private _local: Storage, private _navCtrl: NavController, private _popoverCtrl: PopoverController) {
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
    }
    ngOnInit() {
        this.getInitAdd();
    }
    getInitAdd(eventData?) {
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData.access_token != null) {
                this.getuser_details(userData.secret, eventData);
                this.secret = userData.secret;
            } else {
                this._navCtrl.push(LoginPage);
            }
        })
            .catch((err) => { })
    }

    getuser_details(secret, eventData?) {
        this.spin = true;
        let entity_id = null;
        let body = {
            "secret": secret
        };
        this._address.getAddress().then((address: any) => {
            if (address && address['body'].length > 0 && !eventData) {
                this.myaccount = address;
                this.spin = false;
                this.reverseData(entity_id);
            } else {
                this._myaccount.getMyAccount(body).then((res) => {
                    this.spin = false;
                    this._address.resetAddress();
                    this._address.setAddress(res);
                    this.myaccount = (res);
                    this.reverseData(entity_id);
                })
                    .catch(err => {
                        this.error = true;
                        //                this.logout();
                    })
            }
        }).catch(err => {
            this.error = true;
            //                this.logout();
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
            this._navCtrl.push(MyEditAddressPage, {
                "title": "Add New Address",
                "entity_id": entity_id
            })
        }
    }
    updateAdd(addressChange, change) {
        this.disable = true;
        let address = addressChange;
        //        console.log("address", address)
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
        address['secret'] = this.secret;
        address['zip'] = address.postcode;
        address['countryid'] = address.country_id;
        delete address.postcode;
        delete address.region;
        delete address.country_id;
        delete address.region_id;
        address['default_billing'] = '0';
        address['default_shipping'] = '0';
        if (address.add_billing) {
            address['default_billing'] = '1';
        }
        if (address.add_shipping) {
            address['default_shipping'] = '1';
        }
        this._editaccount.updateAccount(address).then((res) => {
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
    AccountPopoverPage(myEvent: any, id, entity_id) {
        let data = { id: id, entity_id: entity_id, accountCartLen: this.myaccount.body }
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
        })
    }
    logout() {
        this._logout.logout(this.message, this._navCtrl);
    }
}