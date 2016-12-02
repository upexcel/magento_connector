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
    FormBuilder,Validators,FormGroup
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
import {
    ViewController
} from 'ionic-angular';
import reverse from 'lodash/reverse';
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
    reverseCartData:any;
    constructor(public viewCtrl: ViewController,private _country: Country, private _appConfigService: AppDataConfigService, private _logout: LogoutService, private _toast: ToastService, private _events: Events, private _myaccount: MyAccount, private _editaccount: EditAccount, private _navParams: NavParams, private _local: Storage, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _fb: FormBuilder) {}
    ngOnInit() {
        this.title = this._navParams.get("title");
        this.id = this._navParams.get("id");
        this.entity_id = this._navParams.get("entity_id");
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData.access_token != null) {
                this.getuser_details(this.id, this.entity_id, userData.secret);
            } else {}
        });
        this._local.get('store_id').then((store_id) => {
            let data = {"store_id":store_id};
            this._country.getCountryName(data).then((name) => {
                this.counrtyName = name;
            })
        });
        
    }

    getuser_details(id, entity_id, secret) {
        this.spin = true;
        let body = {
            "secret": secret
        };
        if (entity_id != null) {
            this._myaccount.getMyAccount(body).then((res) => {
                    this.myaccount = res;
                    this.reverseCartData=reverse(this.myaccount.body);
                    this.spin = false;
                    if (this.myaccount.body.length != 0 && entity_id != null) {
                        this.updateform = this._fb.group({
                            firstname: [this.reverseCartData[id].firstname, Validators.required],
                            lastname: [this.reverseCartData[id].lastname, Validators.required],
                            city: [this.reverseCartData[id].city, Validators.required],
                            company: [this.reverseCartData[id].company],
                            telephone: [this.reverseCartData[id].telephone, Validators.required],
                            fax: [this.reverseCartData[id].fax ],
                            street: [this.reverseCartData[id].street , Validators.required],
                            zip: [this.reverseCartData[id].postcode , Validators.required],
                            countryid: [this.reverseCartData[id].country_id , Validators.required],
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
                firstname: ['', Validators.required],
                lastname: ['', Validators.required],
                city: ['', Validators.required],
                company: [''],
                telephone: ['', Validators.required],
                fax: [''],
                street: ['', Validators.required],
                zip: ['', Validators.required],
                countryid: ['', Validators.required],
                entity_id: [''],
                secret: [secret]
            })
        }
    }
    update(value: any) {
        this.upd_spin = true;
        this.viewCtrl.dismiss();
        this._editaccount.updateAccount(value).then((res) => {
                this.upd_spin = false;
                this.editaccount = res;
                if (this.editaccount.status === 1) {
                    this._events.publish('api:savedaddress', true);
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