import {Component, AfterContentInit, Input} from '@angular/core';
import {PopoverController, MenuController, NavController, NavParams, Events} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {LoginPage} from '../../pages/login/login';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {PopoverPage} from './../../components/popover/popover';
import {CartPage} from '../../pages/cart/cart';
import {wishList} from '../../pages/wishList/wishList';
import {SearchItemPage} from '../../pages/search-item/search-item'
import {CartFunction} from '../../model/cart/cartHandling';
import {EventService} from './../../providers/headerEvents/headerEvents';
import {ModalController} from 'ionic-angular';
@Component({
    selector: 'header',
    templateUrl: 'headers.html'
})
export class Headers implements AfterContentInit {
    @Input() type: boolean;
    @Input() title: string = '';
    @Input() loading: boolean;
    @Input() view: boolean = false;
    @Input() search: boolean = false;
    @Input() pagename: string = '';
    @Input() menu: boolean = false;
    @Input() wishList: boolean = true;
    @Input() itemName: string = '';
    showPopOver: boolean = false;
    access_token: string;
    showLogin: boolean;
    show: boolean = true;
    viewChang: string = "Landscape";
    cartItems: number = 0;
    wishlist: number;
    searchBar: boolean = false;
    data: any;
    constructor(public modalCtrl: ModalController, public _eventService: EventService, private _cartFunction: CartFunction, private _appConfigService: AppDataConfigService, private _events: Events, private _navParams: NavParams, private _menuCtrl: MenuController, private _local: Storage, private _popoverCtrl: PopoverController, private _navCtrl: NavController) {}
    ngAfterContentInit() {
        // call via cart component  
        this._events.subscribe('check:login', (data) => {
            this.checkAuthorization();
        });
        this.checkAuthorization();
        this._events.subscribe('wishList:length', (data) => {
            this._eventService.setWishList(data);
            this.wishlist = this._eventService.getWishListConuter();
        });
        this._events.subscribe('cartItems:length', (data) => {
            this.cartItems = data;
            this._eventService.setCartCounter(data);
            this.cartItems = this._eventService.getCartCounter();
        });
        this.wishlist = this._eventService.getWishListConuter();
        this.cartItems = this._eventService.getCartCounter();
    }
    goToSearchItemPage() {
        this.searchBar = false;
        this._navCtrl.push(SearchItemPage, {"data": this.data});
    }
    dismiss() {
        this.searchBar = false;
    }

    /*
    *checkAuthorization
    * use to check user is login or not and according authorization show icon
    */
    checkAuthorization() {
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
        // get data length for show on cart icon on header
        this._local.get('CartData').then((value: any) => {
            if (value) {
                this.cartItems = value.length;
            }
        });
    }
    ngOnDestroy() {
        //        this._events.unsubscribe('wishList:length');

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
        this._events.publish('check:loginSideMenu', true);
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
    gotoWishList() {
        this._navCtrl.push(wishList);
    }
    gotoCart() {

        this._navCtrl.push(CartPage);
    }
    gotoSearch() {
        this.searchBar = true;
        // let modal = this.modalCtrl.create(Search);
        // modal.present();
    }
}
