import { NgModule } from '@angular/core';
import { IonicApp, IonicModule, NavController } from 'ionic-angular';
import { MyApp } from './app.component';
import { TourPage } from '../pages/takeTour/tour';
import { StartPage } from '../pages/startpage/startpage';
import { RegisterPage } from '../pages/register/register';
import { CartPage } from '../pages/cart/cart';
import { ProductPage } from '../pages/product/product';
import { OrderlistPage } from '../pages/orderlist/orderlist';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { ForgotPage } from '../pages/forgot/forgot';
import { HomePage } from '../pages/home/home';
import { CategoryProductPage } from '../pages/categoryProduct/categoryProduct';
import { MyAccountPage } from '../pages/myaccount/myaccount';
import { LoginPage } from '../pages/login/login';
import { AppConfig } from '../providers/appConfig/appConfig';
import { LoginConfig } from '../providers/loginConfig/loginConfig';
import { RegisterConfig } from '../providers/registerConfig/registerConfig';
import { CategoryListConfig } from '../providers/homeConfig/categoryListConfig';
import { HomeProductsConfig } from '../providers/homeConfig/homeProductsConfig';
import { SliderConfig } from '../providers/homeConfig/sliderConfig';
import { CartService } from '../providers/cart-service/cart-service';
import { ApiService } from '../providers/api-service/api-service';
import { SocialService } from '../providers/social-service/social-service';
import { LoadingModal } from '../components/loading-modal/loading-modal';
import { PopoverPage } from '../components/popover/popover';
import { Storage } from '@ionic/storage';
import { OrderModalPage } from '../pages/orderid-detail/orderid-detail';
import { NextOnEnter} from '../directives/nextonenter';
import { ConvertCodeToName } from '../pipe/cart/attribute';
import { FacebookComponent } from '../components/facebookLogin/FacebookComponent';
import { GoogleComponent } from '../components/googleLogin/googleComponent';
import { Forgot } from '../modal/forgot/forgot';
import { CategoryProduct } from '../modal/categoryProduct/categoryProduct';
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
    providers: [Storage ,AppConfig, ApiService,
    CartService, SocialService ,LoginConfig,
    RegisterConfig,CategoryListConfig,Forgot,
    SliderConfig,CategoryProduct,
    HomeProductsConfig]

})
export class AppModule {

}
