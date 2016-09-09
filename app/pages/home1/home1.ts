import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, Storage, LocalStorage} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {LoginPage} from './../login/login';
import { Data } from './../../components/data/data';
@Component({
    templateUrl: 'build/pages/home1/home1.html',
    providers: [FormService],
    directives:[]
})
export class HomePage1  {
    lists: any;
    public data: Data[];
    local: any;
    showList:boolean=false;
    constructor(private navCtrl: NavController, private menuCtrl: MenuController, private _formService: FormService) {
        this.local = new Storage(LocalStorage);
    }
    
    openMenu() {
        console.log("nav1");
        this.menuCtrl.open();
    }
    toggle(data: Data) {
        if (data.showDetails) {
            data.showDetails = false;
            data.icon = 'ios-add-circle-outline';
        } else {
            data.showDetails = true;
            data.icon = 'ios-remove-circle-outline';
        }
    }
    logout() {
        this.local.clear('firstname');
        this.local.clear('lastname');
        this.local.clear('expiry');
        this.local.clear('access_token');
        this.local.clear('lists');
        this.navCtrl.setRoot(LoginPage);
    }

}
