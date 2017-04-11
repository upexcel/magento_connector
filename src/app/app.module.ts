import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { SocialSharing } from '@ionic-native/social-sharing';

//storage
import { IonicStorageModule } from '@ionic/storage';
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
import { MyEditAddressPage } from '../pages/myaccount/myeditaddress';
import { Downloadable } from '../pages/myaccount/downloadableProduct';
import { MyEditAccount } from '../pages/myaccount/myEditAccount';
import { LoginPage } from '../pages/login/login';
import { OrderModalPage } from '../pages/orderid-detail/orderid-detail';
import { MySavedAddressPage } from '../pages/myaccount/savedAddress';
import { MyReviews } from '../pages/myaccount/myReviews';
import { ReviewDetails } from '../pages/myaccount/reviewDetails';
import { OfflinePage } from '../pages/offline/offline'
import { wishList } from '../pages/wishList/wishList';
import { Checkout } from '../pages/checkOut/checkout';
import { Policy } from '../pages/policies/policies';
import { AboutUs } from '../pages/aboutUs/aboutUs';
import { ContactUs } from '../pages/contactUs/contactUs';
import { PlacedOrder } from '../pages/placedOrder/placedOrder';


//model
import { AppConfig } from '../model/appConfig/appConfig';
import { Login } from '../model/login/login';
import { Register } from '../model/register/register';
import { CategoryList } from '../model/home/categoryList';
import { HomeProducts } from '../model/home/homeProducts';
import { Product } from '../model/product/getProduct';
import { TierPrice } from '../model/product/checkTierPrice';
import { Cart } from '../model/product/cart';
import { Slider } from '../model/home/slider';
import { ChangePwd } from '../model/changePassword/accountChangePwd';
import { Forgot } from '../model/forgot/forgot';
import { CategoryProduct } from '../model/categoryProduct/categoryProduct';
import { TotalOrder } from '../model/orderList/totalOrder';
import { MyAccount } from '../model/myaccount/myaccount';
import { MyReviewData } from '../model/myaccount/myReviews';
import { MyDownlodeData } from '../model/myaccount/myDownloadableProduct';
import { Country } from '../model/myaccount/country';
import { Edit } from '../model/myaccount/editAccount';
import { OrderIdDetail } from '../model/orderid-detail/orderid-detail';
import { SocialAccount } from '../model/startPage/socialAccount';
import { NotifyMe } from '../model/product/notify';
import { CartFunction } from '../model/cart/cartHandling';
import { SortByModel } from '../model/sortBy/sortBy';
import { FilterByModel } from '../model/filterBy/filterBy';
import { WishListModel } from '../model/wishList/wishList';
import { CMS } from '../model/cms/cms';
//service
import { CartService } from '../providers/cart-service/cart-service';
import { FinalPrice } from '../providers/cart-service/final-price';
import { ApiService } from '../providers/api-service/api-service';
import { SocialService } from '../providers/social-service/social-service';
import { ToastService } from '../providers/toast-service/toastService';
import { LogoutService } from '../providers/logout/logout-service';
import { AppDataConfigService } from '../providers/appdataconfig/appdataconfig';
import { sliderService } from '../providers/slider-service/slider.service';
import { homeProductsService } from '../providers/homeproducts-service/homeproducts.service';
import { categoryService } from '../providers/category-service/category-service';
import { CountryService } from '../providers/myAccount-service/country';
import { FilterService } from '../providers/filter-service/filterService';
import { Address } from '../providers/address-service/address';
import { WishListService } from '../providers/wishList/wishList-service';
import { checkoutService } from '../model/checkout/checkout-service';

//components
import { LoadingModal } from '../components/loading-modal/loading-modal';
import { PopoverPage } from '../components/popover/popover';
import { FacebookComponent } from '../components/facebookLogin/FacebookComponent';
import { GoogleComponent } from '../components/googleLogin/GoogleComponent';
import { ProductReview } from '../components/reviewProduct/ReviewProduct';
import { SubmitReview } from '../components/submitReview/SubmitReview';
import { SliderComponent } from '../components/slider/Slider';
import { CategoryComponent } from '../components/categoryProducts/CategoryProducts';
import { AccountPopoverPage } from '../components/myAccountPopOver/myAccountPopOver';
import { CategoryFooter } from '../components/categoryFooter/categoryFooter';
import { FilterBy } from '../components/filter/filterBy';
import { FilterOption } from '../components/filter/filterOption';
import { SortBy } from '../components/sort/sort';

//directives
import { FocusByEnterKey } from '../directives/focusByEnterKey/nextByEnter';
import { Headers } from '../directives/headers/headers';
import { SideMenu } from '../directives/sidemenu/sidemenu';
import { EqualValidator } from '../directives/password/equalValidator';
import { ImageDirective } from '../directives/image/image.directive';
import { ImageFallBackDirective } from '../directives/image/imagefallback.directive';
import { Button } from '../directives/button/buttonRound.directive';
import { ButtonFull } from '../directives/button/buttonFull.directive';
import { ButtonTour } from '../directives/button/takeTourButton.directive';
import { ButtonForLarge } from '../directives/button/buttonLarge.directive';
import { group } from '../directives/groupedProduct/group';
import { BundleProduct } from '../directives/bundleProduct/bundleProduct';
import { DownloadProduct } from '../directives/downloadProduct/downloadProduct';
import { CustomOption } from '../directives/customOption/customOption';

//pipe
import { ConvertCodeToName } from '../pipe/cart/attribute';
import { ReviewDisplayPipe } from '../pipe/reviewdisplay/reviewdisplay';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { BrowserModule } from '@angular/platform-browser'
import { HttpModule } from '@angular/http';

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
        ConvertCodeToName,
        ReviewDisplayPipe,
        GoogleComponent,
        FacebookComponent,
        ProductReview,
        SubmitReview,
        FocusByEnterKey,
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
        Policy,
        AboutUs,
        ContactUs,
        PlacedOrder,
        Downloadable,
        ReviewDetails
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
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
        Policy,
        AboutUs,
        ContactUs,
        PlacedOrder,
        Downloadable,
        MyReviews,
        ReviewDetails
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
        sliderService,
        homeProductsService,
        categoryService,
        CountryService,
        NotifyMe,
        CartFunction,
        SortByModel,
        FilterByModel,
        WishListModel,
        checkoutService,
        CMS,
        SocialSharing,
        MyDownlodeData,
        MyReviewData
    ]
})
export class AppModule {

}