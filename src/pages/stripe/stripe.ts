import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Stripe} from '@ionic-native/stripe';
import forEach from 'lodash/forEach';
import {Storage} from '@ionic/storage';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {checkoutService} from './../../model/checkout/checkout-service';
import {PlacedOrder} from './../placedOrder/placedOrder';
import {CartFunction} from './../../model/cart/cartHandling';

@Component({
    selector: 'page-stripe',
    templateUrl: 'stripe.html',
})
export class StripePage {
    orderData = {};
    currentYear: number;
    card: any = {};
    type: string = "Unknown";
    validate = {
        name: false,
        cardNumber: false,
        cardDate: false,
        cardCVC: false
    }
    error = {
        name: false,
        cardNumber: false,
        cardDate: false,
        cardCVC: false
    }
    errorMess: string;
    disable: boolean = true;
    address: any;
    pay: string;
    data: any = {};
    spin = false;
    mess = {};
    constructor(private _cartFunction: CartFunction, private viewCtrl: ViewController, private _checkoutService: checkoutService, private _appConfigService: AppDataConfigService, private _local: Storage, private _stripe: Stripe, public _navCtrl: NavController, public _navParams: NavParams) {
        var d = new Date();
        this.currentYear = d.getFullYear();
        this.orderData['address'] = this._navParams.get('data').address;
        this.orderData['placeOrder'] = this._navParams.get('data').orderDetails;
        this.orderData['productPrice'] = this._navParams.get('data').productPrice;
        forEach(this.orderData['address'].body, (value) => {
            if (value.default_billing) {
                this.address = value;
            }
        })
        this.card['address_line1'] = this.address.street[0];
        if (this.address.street && this.address.street.length > 1) {
            this.card['address_line2'] = this.address.street[1];
        }
        this.card['address_country'] = this.address['country_id'];
        this.card['address_state'] = this.address['region'];
        this.card['address_zip'] = this.address['postcode'];
        this.card['address_city'] = this.address['city'];
        this._local.get("web_config").then((web_config) => {
            this.data['currency'] = web_config.body.default_currency;
            this.pay = `Pay  ${this.orderData['productPrice']}  ${this.data['currency']}`
        });
    }
    ionViewDidLoad() {

        this._appConfigService.getUserData().then((userData: any) => {
            if (userData && userData.email) {
                this.data['email'] = userData.email;
            }
        })
    }
    card_holder() {
        if (this.card.name && this.card.name.length) {
            this.validate.name = true;
            this.error.name = false;
            this.validateCard();
        } else {
            this.validate.name = false;
            this.error.name = true;
            this.validateCard();
        }
    }
    card_number() {
        if (this.card.number && this.card.number.length) {
            this._stripe.getCardType(this.card.number).then(type => {
                this.type = type;
            })
            this._stripe.validateCardNumber(this.card.number)
                .then((number) => {
                    this.validate.cardNumber = true;
                    this.error.cardNumber = false;
                    this.validateCard();
                })
                .catch(error => {
                    this.validate.cardNumber = false;
                    this.error.cardNumber = true;
                    this.validateCard();
                });
        } else {
            this.type = 'Unknown';
            this.validate.cardNumber = false;
            this.error.cardNumber = true;
            this.validateCard();
        }

    }
    card_cvc() {
        if (this.card.cvc && this.card.cvc.length) {
            this._stripe.validateCVC(this.card.cvc)
                .then((cvc) => {
                    this.validate.cardCVC = true;
                    this.error.cardCVC = false;
                    this.validateCard();
                })
                .catch(error => {
                    this.validate.cardCVC = false;
                    this.error.cardCVC = true;
                    this.validateCard();
                });
        } else {
            this.validate.cardCVC = false;
            this.error.cardCVC = true;
            this.validateCard();
        }

    }

    genrateToken() {
        if (!this.spin) {
            this.spin = true;
            delete this.card['date'];
            this.errorMess = "";
            this.data['amount'] = this.orderData['productPrice'];
            this.data['description'] = this.data["email"];
            this.data['card'] = this.card;
            let data = {};
            data['data'] = this.data;
            //            data['success'] = true;
            //            data['increment_id'] = this.data["increment_id"];
            data['email'] = this.data["email"];
            data['placeOrder'] = this.orderData['placeOrder'];
            //            delete this.data["increment_id"];
            delete this.data["email"];
            this._checkoutService.updateStripePayment(data).then((res) => {
                this.spin = false;
                if (res['body']['success'] == true) {
                    this._cartFunction.setCartData().then((resp) => {
                    }, (err) => {})
                    this._navCtrl.push(PlacedOrder, {"orderId": res['body']['increment_id']}).then(() => {
                        this._navCtrl.remove(this._navCtrl.getPrevious(this.viewCtrl).index, 2).then(() => {
                        }); //close current page 
                    });
                }
            }, (err) => {
                this.spin = false;
                this.errorMess = err.message;
                this._navCtrl.popToRoot();
            })
        }
    }

    dateChanged() {
        let array = [];
        array = this.card.date.split('-');
        this.card['exp_year'] = array[0];
        this.card['exp_month'] = array[1];
        this._stripe.validateExpiryDate(this.card.exp_month, this.card.exp_year)
            .then((carddate) => {
                this.validate.cardDate = true;
                this.error.cardDate = false;
                this.validateCard();
            })
            .catch(error => {
                this.errorMess = error;
                this.validate.cardDate = false;
                this.error.cardDate = true;
                this.validateCard();
            });
    }
    validateCard() {
        let count = 0;
        forEach(this.validate, (value) => {
            if (value) {
                count++;
            }
        })
        if (count == 4) {
            this.disable = false;
        } else {
            count = 0;
            this.disable = true;
        }
    }
}
