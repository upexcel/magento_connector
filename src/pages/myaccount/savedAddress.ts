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
    StartPage
} from './../../pages/startpage/startpage';
import {
    Storage
} from '@ionic/storage';
import {
    GooglePlus
} from 'ionic-native';
import {
    MyEditAccountPage
} from './myeditaccount';
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
@Component({
    selector:'saved-address',
    templateUrl: 'savedAddress.html'
})
export class MySavedAddressPage implements OnInit {
    myaccount: MyAccountAddressDataType;
    spin: boolean;
    addAddr:boolean=false;
    showAddress: boolean;
    secret: string;
    message: string = "Token expired";
    constructor(private _appConfigService: AppDataConfigService, private _logout: LogoutService, private _toast: ToastService, private _events: Events, private _myaccount: MyAccount, private _local: Storage, private _navCtrl: NavController, private _popoverCtrl: PopoverController) {
        _events.subscribe('api:savedaddress', (savedaddress) => {
            this.getInitAdd();
        });
    }
    ngOnInit() {
        this.getInitAdd();
    }
    getInitAdd() {
        this._appConfigService.getUserData().then((userData: any) => {
                if (userData.access_token != null) {
                    this.getuser_details(userData.secret);
                    this.secret = userData.secret;
                } else {
                    this._navCtrl.push(LoginPage);
                }
            })
            .catch((err) => {})
    }
    ionViewDidEnter() {
        setTimeout(() => {
            this._events.publish("title", {
                title: "My Address"
            });
        }, 0)
    }
    getuser_details(secret) {
        this.spin = true;
        let entity_id = null;
        let body = {
            "secret": secret
        };
        this._myaccount.getMyAccount(body).then((res) => {
                this.spin = false;
                this.myaccount = res;
                if (this.myaccount.data.length != 0) {
                    this.showAddress = true;
                } else {
                    this.showAddress = false;
                    this._navCtrl.push(MyEditAccountPage, {
                        "title": "Add New Address",
                        "entity_id": entity_id
                    })
                }
            })
            .catch(err => {
                this.logout();
            })
    }
    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
    addNewAddress() {
    this.addAddr=true;
    setTimeout(() => {
    this.addAddr=false; }, 1000); 
        let entity_id = null;
        this._navCtrl.push(MyEditAccountPage, {
            "title": "Add New Address",
            "entity_id": entity_id
        })
    }
    editAccount(id, entity_id) {
        this._navCtrl.push(MyEditAccountPage, {
            "title": "Edit Address",
            "id": id,
            "entity_id": entity_id
        })
    }
    deleteAccount(entity_id) {
        let data = {
            entity_id: entity_id,
            secret: this.secret
        };
        this._myaccount.deleteMyAddress(data).then((res) => {
                this._toast.toast("Deleted", 3000, "top");
                this.getInitAdd();
            })
            .catch((err) => {})
    }
    logout() {
        this._logout.logout(this.message, this._navCtrl);
    }
}