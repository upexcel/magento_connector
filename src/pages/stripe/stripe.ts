import {Component} from '@angular/core';
import {NavController, NavParams,ViewController} from 'ionic-angular';
import {Stripe} from '@ionic-native/stripe';
import forEach from 'lodash/forEach';
import {Storage} from '@ionic/storage';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {checkoutService} from './../../model/checkout/checkout-service';
import {PlacedOrder} from './../placedOrder/placedOrder';

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
    constructor( private viewCtrl: ViewController,private _checkoutService: checkoutService, private _appConfigService: AppDataConfigService, private _local: Storage, private _stripe: Stripe, public _navCtrl: NavController, public _navParams: NavParams) {
        var d = new Date();
        this.currentYear = d.getFullYear();
        this.orderData['address'] = this._navParams.get('data').address;
        this.orderData['placeOrder'] = this._navParams.get('data').orderDetails;
        this.orderData['productPrice'] = this._navParams.get('data').productPrice;
        this.data['increment_id'] = this._navParams.get('data').increment_id;
        forEach(this.orderData['address'].body, (value) => {
            if (value.default_billing) {
                this.address = value;
            }
        })
        console.log("address", this.address)
        this.card['address_line1'] = this.address.street[0];
        if (this.address.street && this.address.street.length > 1) {
            this.card['address_line2'] = this.address.street[1];
        }
        this.card['address_country'] = this.address['country_id'];
        this.card['address_state'] = this.address['region'];
        this.card['address_zip'] = this.address['postcode'];
        this.card['address_city'] = this.address['city'];
    }
    ionViewDidLoad() {

        console.log('ionViewDidLoad StripePage');
        this._appConfigService.getUserData().then((userData: any) => {
            if (userData && userData.email) {
                console.log("userData.email", userData.email, userData)
                this.data['email'] = userData.email;
            }
        })
        this._local.get("web_config").then((web_config) => {
            this.data['currency'] = web_config.body.default_currency;
            this.pay = `Pay  ${this.orderData['productPrice']}  ${this.data['currency']}`
        });
    }
    card_holder() {
        console.log("card_holder", this.card.name);
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
            console.log("card_number", this.card.number);
            this._stripe.getCardType(this.card.number).then(type => {
                console.log("type", type);
                this.type = type;
            })
            this._stripe.validateCardNumber(this.card.number)
                .then((number) => {
                    console.log(number)
                    this.validate.cardNumber = true;
                    this.error.cardNumber = false;
                    this.validateCard();
                })
                .catch(error => {
                    console.error(error)
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
        console.log("card_cvc", this.card.cvc.length);
        if (this.card.cvc && this.card.cvc.length) {
            this._stripe.validateCVC(this.card.cvc)
                .then((cvc) => {
                    console.log(cvc)
                    this.validate.cardCVC = true;
                    this.error.cardCVC = false;
                    this.validateCard();
                })
                .catch(error => {
                    console.error("errr", error)
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
            console.log("create token", this.card)
            delete this.card['date'];
            this.errorMess = "";
            this.data['amount'] = this.orderData['productPrice'];
            this.data['description'] = `${this.data["increment_id"]},${this.data["email"]}}`;
            this.data['card'] = this.card;
            let data = {};
            data['data'] = this.data;
            data['success'] = true;
            data['increment_id'] = this.data["increment_id"];
            data['email'] = this.data["email"];
            delete this.data["increment_id"];
            delete this.data["email"];
            this._checkoutService.updateStripePayment(data).then((res) => {
                console.log("res", res);
                this.spin = false;
                if(res['body']['success']==true){
                this._navCtrl.push(PlacedOrder, {"orderId": res['body']['increment_id']}).then(() => {
                    this._navCtrl.remove(this.viewCtrl.index, 1); //close current page 
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
        console.log("dateChanged");
        let array = [];
        console.log("this.myDate", this.card);
        array = this.card.date.split('-');
        this.card['exp_year'] = array[0];
        this.card['exp_month'] = array[1];
        console.log("array", array)
        this._stripe.validateExpiryDate(this.card.exp_month, this.card.exp_year)
            .then((carddate) => {
                console.log(carddate)
                this.validate.cardDate = true;
                this.error.cardDate = false;
                this.validateCard();
            })
            .catch(error => {
                console.error(error)
                this.errorMess = error;
                this.validate.cardDate = false;
                this.error.cardDate = true;
                this.validateCard();
            });
    }
    validateCard() {
        console.log("this.validate", this.validate);
        let count = 0;
        forEach(this.validate, (value) => {
            if (value) {
                count++;
            }
        })

        console.log("count", count);
        if (count == 4) {
            this.disable = false;
        } else {
            count = 0;
            this.disable = true;
        }
    }
}
