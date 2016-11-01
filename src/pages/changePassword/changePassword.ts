
import { Component, OnInit} from '@angular/core';
import { NavController, ToastController, PopoverController,Events } from 'ionic-angular';
import {HomePage} from './../home/home'
import {ApiService} from './../../providers/api-service/api-service'
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import {PopoverPage} from './../../components/popover/popover';
import { ChangePwd } from '../../model/changePassword/accountChangePwd';
import { ChangePwdDataType } from './changePwdDataType';
@Component({
    templateUrl: 'changepassword.html'
})
export class ChangepasswordPage implements OnInit {
    changepassform: any;
    response: ChangePwdDataType;
    email: string;
    access_token: string;
    spin: boolean = false;
    secret: string;
    changeActive: boolean = false;
    constructor(private _events:Events,private _changePwd: ChangePwd, private _local: Storage, private _popoverCtrl: PopoverController, private _navCtrl: NavController, private _toastCtrl: ToastController, private _fb: FormBuilder, private _apiService: ApiService) { }
    ngOnInit() {
        this._local.get('secret').then((value: any) => {
            this.secret = value;
            this._local.get('access_token').then((value: any) => {
                this.access_token = value;
                this.changepassform = this._fb.group({
                    password: ['', Validators.required],
                    newPassword: ['', Validators.required],
                    secret: [this.secret],
                    access_token: [this.access_token]
                });
                this.changeActive = true;
            });
        });
    }
    ionViewDidEnter() {
       setTimeout( () => {  this._events.publish("title","Change Password"); } , 0)
      }
    changepassword(value: any) {
        this.spin = true;
        this._changePwd.getPwd(value).then((res) => {
            this.spin = false;
            this.response = res;
            this.showToast(this.response.data);
            this._navCtrl.setRoot(HomePage);
        })
    }
    showToast(message: string) {
        let toast = this._toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.present();
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
