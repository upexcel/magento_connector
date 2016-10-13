import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { tourPage } from '../pages/takeTour/tour';
import { StartPage } from '../pages/startpage/startpage';
import { RegisterPage } from '../pages/register/register';
import { cartpage } from '../pages/cart/cart';
import { productpage } from '../pages/product/product';
import { OrderlistPage } from '../pages/orderlist/orderlist';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { ForgotPage } from '../pages/forgot/forgot';
import { HomePage } from '../pages/home/home';
import { HomePage1 } from '../pages/home1/home1';
import { MyaccountPage } from '../pages/myaccount/myaccount';
import { LoginPage } from '../pages/login/login';
 import { cartService } from '../providers/form-service/cartService';
import { FormService } from '../providers/form-service/form-service';
import { Data } from '../components/data/data';
import { LoadingModal } from '../components/loading-modal/loading-modal';
import { PopoverPage } from '../components/popover/popover';
import { Storage } from '@ionic/storage';
import { OrderModalPage } from '../pages/orderid-detail/orderid-detail';
import { filter } from '../pipe/pipe';
 // import {FORM_DIRECTIVES} from '@angular/common';
 // import {IONIC_DIRECTIVES} from 'ionic-angular';
@NgModule({
    declarations: [
        MyApp,
        cartpage,
        tourPage,
        StartPage,
        RegisterPage,
        productpage,
        OrderlistPage,
        ChangepasswordPage,
        ForgotPage,
        HomePage,
        HomePage1,
        OrderModalPage,
        MyaccountPage,
        LoginPage,
        Data,
        LoadingModal,
        PopoverPage,
        filter
        //        IONIC_DIRECTIVES
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        cartpage,
        tourPage,
        StartPage,
        RegisterPage,
        productpage,
        OrderlistPage,
        OrderModalPage,
        ChangepasswordPage,
        ForgotPage,
        HomePage,
        HomePage1,
        MyaccountPage,
        LoginPage,
        PopoverPage
    ],
    providers: [Storage, FormService,cartService]
})
export class AppModule {

}
