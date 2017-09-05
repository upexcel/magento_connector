import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
    selector: 'page-reset-password',
    templateUrl: 'reset-password.html',
})
export class ResetPasswordPage implements OnInit {
    user: any;
    spin: boolean = false;
    n_pass: string = "password";
    c_pass: string = "password";
    token: string;
    constructor(public navCtrl: NavController, public navParams: NavParams) {}

    ngOnInit() {
        this.token = this.navParams['data']['token'];//get token
        this.user = {
            newPassword: '',
            confirmPassword: ''
        }
    }
    resetPassword(model, isValid: boolean) {
        this.spin = true;
        // let data = { "password": model.password, "newPassword": model.newPassword, access_token: this.access_token }
        // this._changePwd.getPwd(data).then((res: any) => {
        //     this.spin = false;
        //     this.response = res;
        //     this._toast.toast(res.body, 3000, "bottom");
        //     if (res.body == 'Your Password has been Changed Successfully') {
        //         this._navCtrl.setRoot(HomePage);
        //     }
        // }).catch(err => {
        //     this.spin = false;
        // })
    }

}
