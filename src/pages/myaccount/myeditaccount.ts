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
    FormBuilder
} from '@angular/forms';
import {
    StartPage
} from './../../pages/startpage/startpage';
import {
    Storage
} from '@ionic/storage';
import {
    GooglePlus
} from 'ionic-native';
import {
    MyAccount
} from './../../model/myaccount/myaccount';
import {
    EditAccount
} from './../../model/myaccount/editAccount';
import {
    MyAccountAddressDataType
} from './../../model/myaccount/myaccountData';
import {
    EditAccountDataType
} from './../../model/myaccount/editAccountData';
import {
    MySavedAddressPage
} from './savedAddress';
import {
    LogoutService
} from './../../providers/logout/logout-service';
import {
    ToastService
} from './../../providers/toast-service/toastService';
import {
    AppDataConfigService
} from './../../providers/appdataconfig/appdataconfig';
import {
    Country
} from './../../model/myaccount/country';

@Component({
    templateUrl: 'myeditaccount.html'
})
export class MyEditAccountPage implements OnInit {
    myaccount: MyAccountAddressDataType;
    editaccount: EditAccountDataType;
    spin: boolean ;
    updateform: any;
    upd_spin: boolean = false;
    title: string;
    id: any;
    entity_id: any;
    message: string = "Token expired";
    counrtyName: any;
    constructor(private _country: Country, private _appConfigService: AppDataConfigService, private _logout: LogoutService, private _toast: ToastService, private _events: Events, private _myaccount: MyAccount, private _editaccount: EditAccount, private _navParams: NavParams, private _local: Storage, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _fb: FormBuilder) {}
    ngOnInit() {
        this.title = this._navParams.get("title");
        this.id = this._navParams.get("id");
        this.entity_id = this._navParams.get("entity_id");
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData.access_token != null) {
                this.getuser_details(this.id, this.entity_id, userData.secret);
            } else {}
        });
        this._country.getCountryName().then((name) => {
            this.counrtyName = name;
        })
    }
    ionViewDidEnter() {
        setTimeout(() => {
            this._events.publish("title", {
                title: this.title
            });
        }, 0)
    }
    getuser_details(id, entity_id, secret) {
        this.spin = true;
        let body = {
            "secret": secret
        };
        if (entity_id != null) {
            this._myaccount.getMyAccount(body).then((res) => {
                    this.myaccount = res;
                    this.spin = false;
                    if (this.myaccount.data.length != 0 && entity_id != null) {
                        this.updateform = this._fb.group({
                            firstname: [this.myaccount.data[id].firstname],
                            lastname: [this.myaccount.data[id].lastname],
                            city: [this.myaccount.data[id].city],
                            company: [this.myaccount.data[id].company],
                            telephone: [this.myaccount.data[id].telephone],
                            fax: [this.myaccount.data[id].fax],
                            street: [this.myaccount.data[id].street],
                            zip: [this.myaccount.data[id].postcode],
                            countryid: [this.myaccount.data[id].country_id],
                            entity_id: [entity_id],
                            secret: [secret]
                        })
                    }
                })
                .catch(err => {
                    this.logout();
                })
        } else {
          this.spin = false;
            this.updateform = this._fb.group({
                firstname: [''],
                lastname: [''],
                city: [''],
                company: [''],
                telephone: [''],
                fax: [''],
                street: [''],
                zip: [''],
                countryid: [''],
                entity_id: [''],
                secret: [secret]
            })
        }
    }
    update(value: any) {
        this.upd_spin = true;
        this._editaccount.updateAccount(value).then((res) => {
                this.upd_spin = false;
                this.editaccount = res;
                if (this.editaccount.status === 1) {
                    this._events.publish('api:savedaddress', true);
                    this._navCtrl.pop();
                } else {
                    this._toast.toast(JSON.parse(this.editaccount.message).error, 3000, "top");
                }
            })
            .catch(err => {});
    }
    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
    logout() {
        this._logout.logout(this.message, this._navCtrl);
    }
}