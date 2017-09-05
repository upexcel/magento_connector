import {Component, OnInit} from '@angular/core';
import {NavController, PopoverController, Events} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {PopoverPage} from './../../components/popover/popover';
import {ChangePwd} from '../../model/changePassword/accountChangePwd';
import {ChangePwdDataType} from '../../model/changePassword/changePwdDataType';
import {ToastService} from './../../providers/toast-service/toastService';
import {User} from './userInterface';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';

@Component({
    selector: 'change-pass',
    templateUrl: 'changepassword.html'
})
export class ChangepasswordPage implements OnInit {
    response: ChangePwdDataType;
    access_token: string;
    spin: boolean = false;    //use for spinner control
    o_pass: string = "password"; //old password
    n_pass: string = "password";    //new password
    c_pass: string = "password";    //confirm password
    public user: User;
    constructor(private _appConfigService: AppDataConfigService, private _toast: ToastService, private _events: Events, private _changePwd: ChangePwd, private _local: Storage, private _popoverCtrl: PopoverController, private _navCtrl: NavController) {}
    ngOnInit() {
        this.user = {
            password: '',
            newPassword: '',
            confirmPassword: ''
        }
        this._appConfigService.getUserData().then((userData: any) => { //get user data
            this.access_token = userData.access_token; //access_token use for authentication
        });
        }    
    /**
    * show_products
    *
    * function call for change password 
    **/

    changepassword(model: User, isValid: boolean) {
        this.spin = true;
        let data = {"password": model.password, "newPassword": model.newPassword, access_token: this.access_token ? this.access_token : 'false'}
        this._changePwd.getPwd(data).then((res: any) => { //call apin changePassword
            this.spin = false;
            this.response = res;
            this._toast.toast(res.body, 3000, "bottom");
            if (res.body == 'Your Password has been Changed Successfully') {
                this._navCtrl.popToRoot();   //if successfull mave to root
            }
        }).catch(err => {
            this.spin = false;
        })
    }

    doRefresh(refresher) {
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }
}
