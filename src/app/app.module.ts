import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
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
import { HomePage1 } from '../pages/home1/home1';
import { MyAccountPage } from '../pages/myaccount/myaccount';
import { LoginPage } from '../pages/login/login';
 import { CartService } from '../providers/form-service/cartService';
import { FormService } from '../providers/form-service/form-service';
import { FbProvider } from '../providers/fb-service/fb-service';
import { Data } from '../components/data/data';
import { LoadingModal } from '../components/loading-modal/loading-modal';
import { PopoverPage } from '../components/popover/popover';
import { Storage } from '@ionic/storage';
import { OrderModalPage } from '../pages/orderid-detail/orderid-detail';
import { NextOnEnter} from '../directives/nextonenter';
import { Filter } from '../pipe/pipe';
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
        HomePage1,
        OrderModalPage,
        MyAccountPage,
        LoginPage,
        Data,
        LoadingModal,
        PopoverPage,
        NextOnEnter,
        Filter
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
        ChangepasswordPage,
        ForgotPage,
        HomePage,
        HomePage1,
        MyAccountPage,
        LoginPage,
        PopoverPage
    ],
    providers: [Storage, FormService,CartService,FbProvider]
})
export class AppModule {

}
