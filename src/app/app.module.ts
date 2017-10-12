
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {SocialSharing} from '@ionic-native/social-sharing';
import {Keyboard} from '@ionic-native/keyboard';
import {Firebase} from '@ionic-native/firebase';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {IonicImageViewerModule} from 'ionic-img-viewer';
import {HttpModule} from '@angular/http';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {Network} from '@ionic-native/network';
import {StatusBar} from '@ionic-native/status-bar';
import {Stripe} from '@ionic-native/stripe';
import { Deeplinks } from '@ionic-native/deeplinks';

//storage
import {IonicStorageModule} from '@ionic/storage';
//pages
import {TourPage} from '../pages/takeTour/tour';
import {StartPage} from '../pages/startpage/startpage';
import {RegisterPage} from '../pages/register/register';
import {CartPage} from '../pages/cart/cart';
import {ProductPage} from '../pages/product/product';
import {OrderlistPage} from '../pages/orderList/orderList';
import {ChangepasswordPage} from '../pages/changePassword/changePassword';
import {ForgotPage} from '../pages/forgot/forgot';
import {HomePage} from '../pages/home/home';
import {CategoryProductPage} from '../pages/categoryProduct/categoryProduct';
import {MyEditAddressPage} from '../pages/myaccount/myeditaddress';
import {Downloadable} from '../pages/myaccount/downloadableProduct';
import {MyEditAccount} from '../pages/myaccount/myEditAccount';
import {LoginPage} from '../pages/login/login';
import {OrderModalPage} from '../pages/orderid-detail/orderid-detail';
import {MySavedAddressPage} from '../pages/myaccount/savedAddress';
import {MyReviews} from '../pages/myaccount/myReviews';
import {ReviewDetails} from '../pages/myaccount/reviewDetails';
import {OfflinePage} from '../pages/offline/offline'
import {wishList} from '../pages/wishList/wishList';
import {Checkout} from '../pages/checkOut/checkout';
import {cmsPages} from '../pages/cmsPages/cmsPages';
import {ContactUs} from '../pages/contactUs/contactUs';
import {PlacedOrder} from '../pages/placedOrder/placedOrder';
import {SearchItemPage} from '../pages/search-item/search-item';
import {ResetPasswordPage} from '../pages/reset-password/reset-password';
import {StripePage} from '../pages/stripe/stripe';

//model
import {AppConfig} from '../model/appConfig/appConfig';
import {Login} from '../model/login/login';
import {LOGOUT} from '../model/logout/logout';
import {Register} from '../model/register/register';
import {CategoryList} from '../model/home/categoryList';
import {HomeProducts} from '../model/home/homeProducts';
import {Product} from '../model/product/getProduct';
import {TierPrice} from '../model/product/checkTierPrice';
import {Cart} from '../model/product/cart';
import {Slider} from '../model/home/slider';
import {ChangePwd} from '../model/changePassword/accountChangePwd';
import {Forgot} from '../model/forgot/forgot';
import {CategoryProduct} from '../model/categoryProduct/categoryProduct';
import {TotalOrder} from '../model/orderList/totalOrder';
import {MyAccount} from '../model/myaccount/myaccount';
import {MyReviewData} from '../model/myaccount/myReviews';
import {MyDownlodeData} from '../model/myaccount/myDownloadableProduct';
import {Country} from '../model/myaccount/country';
import {Edit} from '../model/myaccount/editAccount';
import {OrderIdDetail} from '../model/orderid-detail/orderid-detail';
import {SocialAccount} from '../model/startPage/socialAccount';
import {NotifyMe} from '../model/product/notify';
import {CartFunction} from '../model/cart/cartHandling';
import {SortByModel} from '../model/sortBy/sortBy';
import {FilterByModel} from '../model/filterBy/filterBy';
import {WishListModel} from '../model/wishList/wishList';
import {CMS} from '../model/cms/cms';
import {SearchModel} from '../model/search/search';
//service
import {CartService} from '../providers/cart-service/cart-service';
import {FinalPrice} from '../providers/cart-service/final-price';
import {ApiService} from '../providers/api-service/api-service';
import {SocialService} from '../providers/social-service/social-service';
import {ToastService} from '../providers/toast-service/toastService';
import {LogoutService} from '../providers/logout/logout-service';
import {AppDataConfigService} from '../providers/appdataconfig/appdataconfig';
import {CountryService} from '../providers/myAccount-service/country';
import {FilterService} from '../providers/filter-service/filterService';
import {Address} from '../providers/address-service/address';
import {WishListService} from '../providers/wishList/wishList-service';
import {checkoutService} from '../model/checkout/checkout-service';
import {fcmService} from '../providers/fcm-service/fcm-service';
import {EventService} from '../providers/headerEvents/headerEvents';
import {SideMenuService} from '../providers/sideMenu/sideMenu';
import {LoaderProvider} from '../providers/loader/loader';

//components
import {LoadingModal} from '../components/loading-modal/loading-modal';
import {PopoverPage} from '../components/popover/popover';
import {FacebookComponent} from '../components/facebookLogin/FacebookComponent';
import {GoogleComponent} from '../components/googleLogin/GoogleComponent';
import {ProductReview} from '../components/reviewProduct/ReviewProduct';
import {SubmitReview} from '../components/submitReview/SubmitReview';
import {SliderComponent} from '../components/slider/Slider';
import {CategoryComponent} from '../components/categoryProducts/CategoryProducts';
import {AccountPopoverPage} from '../components/myAccountPopOver/myAccountPopOver';
import {CategoryFooter} from '../components/categoryFooter/categoryFooter';
import {FilterBy} from '../components/filter/filterBy';
import {FilterOption} from '../components/filter/filterOption';
import {SortBy} from '../components/sort/sort';
import {Headers} from '../components/headers/headers';
import {SideMenu} from '../components/sidemenu/sidemenu';
import {SideMenuChild} from '../components/sidemenu/sideMenuChildren';
import {Button} from '../components/button/buttonRound.directive';
import {ButtonFull} from '../components/button/buttonFull.directive';
import {ButtonTour} from '../components/button/takeTourButton.directive';
import {ButtonForLarge} from '../components/button/buttonLarge.directive';
import {group} from '../components/groupedProduct/group';
import {BundleProduct} from '../components/bundleProduct/bundleProduct';
import {DownloadProduct} from '../components/downloadProduct/downloadProduct';
import {CustomOption} from '../components/customOption/customOption';
//directives
import {FocusByEnterKey} from '../directives/focusByEnterKey/nextByEnter';
import {HeaderScroller} from '../directives/header-scroller';
import {ShrinkHeader} from '../directives/shrink-header/shrink-header';
import {EqualValidator} from '../directives/password/equalValidator';
import {ImageDirective} from '../directives/image/image.directive';
import {ImageFallBackDirective} from '../directives/image/imagefallback.directive';

//pipe
import {ReviewDisplayPipe} from '../pipe/reviewdisplay/reviewdisplay';
import {CustomDatePipe} from '../pipe/date/dateFormate';

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
        CategoryComponent,
        FilterBy,
        CategoryFooter,
        FilterOption,
        AccountPopoverPage,
        HomePage,
        MyEditAccount,
        CategoryProductPage,
        OrderModalPage,
        MyEditAddressPage,
        MySavedAddressPage,
        MyReviews,
        LoginPage,
        LoadingModal,
        PopoverPage,
        Headers,
        SliderComponent,
        SideMenu,
        SideMenuChild,
        ReviewDisplayPipe,
        CustomDatePipe,
        GoogleComponent,
        FacebookComponent,
        ProductReview,
        SubmitReview,
        FocusByEnterKey,
        HeaderScroller,
        EqualValidator,
        ImageDirective,
        OfflinePage,
        ImageFallBackDirective,
        Button,
        ButtonFull,
        SortBy,
        ButtonTour,
        ButtonForLarge,
        BundleProduct,
        DownloadProduct,
        CustomOption,
        group,
        wishList,
        Checkout,
        cmsPages,
        ContactUs,
        PlacedOrder,
        Downloadable,
        ReviewDetails,
        ResetPasswordPage,
        SearchItemPage,
        StripePage,
        ShrinkHeader
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpModule,
        IonicImageViewerModule,
        IonicStorageModule.forRoot()
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
        AccountPopoverPage,
        ForgotPage,
        HomePage,
        MyEditAccount,
        CategoryProductPage,
        CategoryComponent,
        FilterBy,
        SortBy,
        CategoryFooter,
        MyEditAddressPage,
        MySavedAddressPage,
        LoginPage,
        FilterOption,
        PopoverPage,
        SubmitReview,
        Headers,
        OfflinePage,
        wishList,
        Checkout,
        cmsPages,
        ContactUs,
        PlacedOrder,
        Downloadable,
        MyReviews,
        ReviewDetails,
        ResetPasswordPage,
        SearchItemPage,
        StripePage
    ],
    providers: [
        AppConfig,
        FilterService,
        Address,
        WishListService,
        IonicStorageModule,
        ApiService,
        CartService,
        FinalPrice,
        SocialService,
        Login,
        LOGOUT,
        Register,
        CategoryList,
        Forgot,
        Slider,
        CategoryProduct,
        HomeProducts,
        Product,
        TierPrice,
        Cart,
        ChangePwd,
        TotalOrder,
        MyAccount,
        Country,
        Edit,
        SocialAccount,
        OrderIdDetail,
        ToastService,
        LogoutService,
        AppDataConfigService,
        CountryService,
        NotifyMe,
        CartFunction,
        SortByModel,
        FilterByModel,
        WishListModel,
        checkoutService,
        CMS,
        SearchModel,
        SocialSharing,
        Keyboard,
        MyDownlodeData,
        MyReviewData,
        Firebase,
        LocalNotifications,
        fcmService,
        EventService,
        SideMenuService,
        InAppBrowser,
        Network,
        StatusBar,
        Stripe,
        LoaderProvider,
        Deeplinks]
})
export class AppModule {}