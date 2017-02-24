import { Component, AfterContentInit, Input } from '@angular/core';
import { PopoverController, MenuController, NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../../pages/login/login';
import { AppDataConfigService } from './../../providers/appdataconfig/appdataconfig';
import { PopoverPage } from './../../components/popover/popover';
import { CartPage } from '../../pages/cart/cart';

@Component({
    selector: 'header',
    templateUrl: 'headers.html'
})

export class Headers implements AfterContentInit {
    @Input() type: boolean;
    @Input() title: string = '';
    @Input() loading: boolean;
    @Input() view: boolean=false;
    @Input() pagename: string = '';
    @Input() menu: boolean = false;
    showPopOver: boolean = false;
    access_token: string;
    showLogin: boolean;
    show: boolean = true;
    viewChang: string = "Landscape";
    cartItems: number;
    constructor(private _appConfigService: AppDataConfigService, private _events: Events, private _navParams: NavParams, private _menuCtrl: MenuController, private _local: Storage, private _popoverCtrl: PopoverController, private _navCtrl: NavController) { }
    ngAfterContentInit() {
        if (this.title == "LOGIN" || this.title == 'SIGN UP' || this.title == 'My Orders') {
            this.showLogin = false;
        } else {
            this.showLogin = true;
        }
        this.access_token = this._navParams.get("access_token");
        this._appConfigService.getUserData().then((userData: any) => {
            if (this.access_token != null || userData != null) {
                this.showPopOver = true;
            } else {
                this.showPopOver = false;
            }
        });
        if (this.type == true) {
            this.show = false;
        }
        this._local.get('CartData').then((value: any) => {
            if(value && value.length > 0){
                this.cartItems = value.length;
            }
        });
        this._events.subscribe('cartItems:length', (data) => {
            if(data && data > 0){
                this.cartItems = data;
            }
        });
    }
    changeView(view) {
        if (view == "portrait") {
            this.viewChang = "Landscape";
        }
        else {
            this.viewChang = "portrait";
        }
        this._events.publish('view:created', this.viewChang);
    }
    openMenu() {
        this._menuCtrl.toggle();
    }
    gotoLogin() {
        this._navCtrl.push(LoginPage);
    }
    presentPopover(myEvent) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent
        });
    }
    gotoCart() {
        this._navCtrl.push(CartPage);
    }
}
