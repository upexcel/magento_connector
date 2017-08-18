import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, NavParams, AlertController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {TourPage} from '../takeTour/tour';
import {Storage} from '@ionic/storage';
import {AppConfig} from '../../model/appConfig/appConfig';
import {config} from './../../providers/config/config';
import {SocialService} from '../../providers/social-service/social-service';
import {HomePage} from '../../pages/home/home';
import {SocialAccountDataType} from '../../model/startPage/socialAccountDataType';
import {SocialAccount} from './../../model/startPage/socialAccount';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {CategoryList} from './../../model/home/categoryList';
import {HomeProducts} from '../../model/home/homeProducts';
import {Slider} from './../../model/home/slider';

@Component({
    selector: 'start-page',
    templateUrl: 'startpage.html'
})
export class StartPage implements OnInit {
    // data: ConfigDataType;
    data: any;
    socialData: SocialAccountDataType;
    messsage_expired: string;
    check: boolean = false;
    options: {};
    constructor(private _sliderService: Slider,private _homeProductsConfig: HomeProducts, private _categoryService: CategoryList, private _socialAccount: SocialAccount, private _appConfig: AppConfig, public _local: Storage, public _socialProvider: SocialService, private _alertCtrl: AlertController,
        private _navCtrl: NavController, private _navparam: NavParams,
        private _modelCtrl: ModalController, private _appConfigService: AppDataConfigService) {
    }

    ngOnInit() {
        this.messsage_expired = this._navparam.get("message");// get expire message
        this.options = {    //  get value from config 
            clientid: config.google_clientid
        }
        this._appConfigService.resetDataInService();//reset data from service
        this._appConfig.getAppConfig().then((res) => { // get data from local
            this.data = res;
            this._local.set('website_id', this.data.body.website_id);//set website_id on local storage
            this._local.set('store_id', this.data.body.store_id);//set store_id on local storage
            this._local.set('require_login', this.data.body.store_id);//set require_login on local storage
            this._categoryService.getCategoryList();
            this._sliderService.getSlider();
            this.check = true;
            this._homeProductsConfig.resetHomeProducts();
            setTimeout(()=>{this._homeProductsConfig.getHomeProducts();},300)
        })
            .catch((err) => {
                this.showSocialLoginError(err);
            });
    }
    gotologin() {
        this._navCtrl.push(LoginPage);//move to Login Page
    }
    presentProfileModal() {
        let profileModal = this._modelCtrl.create(TourPage);
        profileModal.present();
    }
    /**
    * userFbLogin
    *
    * Use of this source code is to facebook login and move page to home page
    **/
    userFbLogin(body) {
        this._socialAccount.getSocialAccount(body.data).then((res: any) => {
            this.socialData = res;
            this._appConfigService.setUserData(res.body);
            this._navCtrl.setRoot(HomePage, {"access_token": res.body.access_token});
        });
    }
    /**
    * userGoogleLogin
    *
    * Use of this source code is to google login and move page to home page
    **/
    userGoogleLogin(body) {
        this._socialAccount.getSocialAccount(body).then((res: any) => {
            this.socialData = res;
            this._appConfigService.setUserData(res.body);
            this._navCtrl.setRoot(HomePage, {"access_token": res.body.access_token});
        });
    }
    showSocialLoginError(error) {
        let alert = this._alertCtrl.create({
            title: 'Error',
            subTitle: error,
            buttons: ['OK']
        });
        alert.present();
    }
}
