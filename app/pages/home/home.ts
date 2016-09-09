import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, Storage, LocalStorage} from 'ionic-angular';
import {FormService } from './../../providers/form-service/form-service';
import {LoginPage} from './../login/login';
import {HomePage1} from '../home1/home1';
import { Data } from './../../components/data/data';
@Component({
    templateUrl: 'build/pages/home/home.html',
    providers: [FormService],
    directives: []
})
export class HomePage implements OnInit {
    lists: any;
    rootPage: any;
    public data: Data[];
    local: any;
    showList: boolean = false;
    constructor(private navCtrl: NavController, private menuCtrl: MenuController, private _formService: FormService) {
       
    }
    ngOnInit() {
       this.local = new Storage(LocalStorage);
       this.rootPage=HomePage1;

            var path = { "parent_id": "1", "type": "full" }
            this._formService.api("category/categorylist/", path).subscribe((res) => {
                if (res) {
                    this.lists = res.data.children;
                    this.local.set('lists', JSON.stringify(this.lists));
                }
            },
                (err) => {
                    if (err) {
                        console.log(err);
                    }

                })
        
    }
    openMenu() {
        this.showList = true;
        console.log("nav");
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
