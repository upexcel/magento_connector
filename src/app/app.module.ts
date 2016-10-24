import { NgModule } from '@angular/core';
import { IonicApp, IonicModule, NavController } from 'ionic-angular';
import { MyApp } from './app.component';
//storage
import { Storage } from '@ionic/storage';
//pages
import { TourPage } from '../pages/takeTour/tour';
import { StartPage } from '../pages/startpage/startpage';
import { RegisterPage } from '../pages/register/register';
import { CartPage } from '../pages/cart/cart';
import { ProductPage } from '../pages/product/product';
import { OrderlistPage } from '../pages/orderList/orderList';
import { ChangepasswordPage } from '../pages/changePassword/changePassword';
import { ForgotPage } from '../pages/forgot/forgot';
import { HomePage } from '../pages/home/home';
import { CategoryProductPage } from '../pages/categoryProduct/categoryProduct';
import { MyAccountPage } from '../pages/myaccount/myaccount';
import { LoginPage } from '../pages/login/login';
import { OrderModalPage } from '../pages/orderid-detail/orderid-detail';

//modal
import { AppConfig } from '../modal/appConfig/appConfig';
import { Login } from '../modal/login/login';
import { Register } from '../modal/register/register';
import { CategoryList } from '../modal/home/categoryList';
import { HomeProducts } from '../modal/home/homeProducts';
import { Product } from '../modal/product/getProduct';
import { Cart } from '../modal/product/cart';
import { Slider } from '../modal/home/slider';
import { ChangePwd } from '../modal/changePassword/accountChangePwd';
import { Forgot } from '../modal/forgot/forgot';
import { CategoryProduct } from '../modal/categoryProduct/categoryProduct';
import { TotalOrder } from '../modal/orderList/totalOrder';
import {MyAccount} from '../modal/myaccount/myaccount';
import {EditAccount} from '../modal/myaccount/editAccount';

//service
import { CartService } from '../providers/cart-service/cart-service';
import { ApiService } from '../providers/api-service/api-service';
import { SocialService } from '../providers/social-service/social-service';

//components
import { LoadingModal } from '../components/loading-modal/loading-modal';
import { PopoverPage } from '../components/popover/popover';
import { FacebookComponent } from '../components/facebookLogin/FacebookComponent';
import { GoogleComponent } from '../components/googleLogin/googleComponent';

//directives
import { NextOnEnter} from '../directives/nextonenter';
//pipe

import { ConvertCodeToName } from '../pipe/cart/attribute';




@NgModule({
    declarations: [
        MyApp,
        CartPage,
        TourPage,
        StartPage,
        RegisterPage,
        ProductPage,
        OrderlistPage,
        ChangepasswordPage,
        ForgotPage,
        HomePage,
        CategoryProductPage,
        OrderModalPage,
        MyAccountPage,
        LoginPage,
        LoadingModal,
        PopoverPage,
        NextOnEnter,
        ConvertCodeToName,
        GoogleComponent,
        FacebookComponent
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        CartPage,
        TourPage,
        StartPage,
        RegisterPage,
        ProductPage,
        OrderlistPage,
        OrderModalPage,
        ChangepasswordPage,
        ForgotPage,
        HomePage,
        CategoryProductPage,
        MyAccountPage,
        LoginPage,
        PopoverPage
    ],
    providers: [Storage,
        AppConfig,
        ApiService,
        CartService,
        SocialService,
        Login,
        Register,
        CategoryList,
        Forgot,
        Slider,
        CategoryProduct,
        HomeProducts,
        Product, Cart,
        ChangePwd,
        TotalOrder,
        MyAccount,
        EditAccount]

})
export class AppModule {

}
