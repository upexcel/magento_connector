import {
    Component,
    OnInit
} from '@angular/core';
import {
    NavController,
    PopoverController,
    NavParams,
    Events,
    Platform
} from 'ionic-angular';
import {
    PopoverPage
} from './../../components/popover/popover';
import {
    FormBuilder, Validators
} from '@angular/forms';
import {
    MyAccount
} from './../../model/myaccount/myaccount';
import {
    Edit
} from './../../model/myaccount/editAccount';
import {
    MyAccountAddressDataType
} from './../../model/myaccount/myaccountData';
import {
    EditAccountDataType
} from './../../model/myaccount/editAccountData';

import {
    ToastService
} from './../../providers/toast-service/toastService';
import {
    AppDataConfigService
} from './../../providers/appdataconfig/appdataconfig';
import {
    Country
} from './../../model/myaccount/country';
import {
    ViewController
} from 'ionic-angular';
import find from 'lodash/find';
import {MySavedAddressPage} from './../myaccount/savedAddress';

@Component({
    selector: 'edit-address',
    templateUrl: 'myeditaddress.html'
})
export class MyEditAddressPage implements OnInit {
    myaccount: MyAccountAddressDataType;
    editaccount: EditAccountDataType;
    spin: boolean;
    updateform: any;
    upd_spin: boolean = false;
    title: string;
    id: any;
    entity_id: any;
    message: string = "Token expired";
    counrtyName: object;
    default_billing: any = 0;
    default_shipping: any = 0;
    reverseCartData: Array<any>;
    firstTime = 0;
    checkBilling = 0;
    checkShipping = 0;
    countryObj: any;
    constructor(private _platform: Platform, public viewCtrl: ViewController, private _country: Country, private _appConfigService: AppDataConfigService, private _toast: ToastService, private _events: Events, private _myaccount: MyAccount, private _edit: Edit, private _navParams: NavParams, private _navCtrl: NavController, private _popoverCtrl: PopoverController, private _fb: FormBuilder) {}
    ngOnInit() {
        this._events.unsubscribe('user:edit');    //unsubscribe user:edit event
        this._events.unsubscribe('user:deleted');//unsubscribe user:deleted event
        this._events.unsubscribe('api:savedaddress');//unsubscribe api:savedaddress event
        this.title = this._navParams.get("title");    //get page title (is it edit or Add page)
        this.id = this._navParams.get("id");
        this.firstTime = this._navParams.get("firstTime");
        this.entity_id = this._navParams.get("entity_id");//get entity id
        this.spin = true;//spinner on
        this._country.getCountryName().then((name) => { // call api for get country name
            this.counrtyName = name;
            this._appConfigService.getUserData().then((userData: any) => { // get user details
                if (userData.access_token != null) {
                    this.getuser_details(this.id, this.entity_id, userData.firstname, userData.lastname);
                } else {}
            });
        })

    }
    /*
     *         return this._platform.is('ios');
     */
    platform() {
        return this._platform.is('ios'); 
    }
    root() {
        this._navCtrl.push(MySavedAddressPage, {'againOpenEditAddressPage': false}).then(() => {
            const index = this.viewCtrl.index;
            this._navCtrl.remove(index);
        });
    }
    onChangeCountry(countryid, updateform?) {
        this.countryObj = countryid;
        if (updateform) {
            this.updateform = this._fb.group({ //check validation and update form data object
                firstname: [updateform.firstname, Validators.required],
                lastname: [updateform.lastname, Validators.required],
                city: [updateform.city, Validators.required],
                company: [updateform.company],
                telephone: [updateform.telephone, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
                fax: [updateform.fax],
                street: [updateform.street, Validators.required],
                zip: [updateform.zip, Validators.required],
                region: ['', Validators.required],
                countryid: [updateform.countryid, Validators.required],
                default_billing: [updateform.default_billing],
                default_shipping: [updateform.default_shipping],
                entity_id: [updateform.entity_id]
            })
        }
    }
    /*
     * use for get user details
     */
    getuser_details(id, entity_id, firstname?, lastname?) { 
        this.spin = true;
        var rName;
        if (entity_id != null) {    // form use as edit perpose
            this._myaccount.getMyAccount({}).then((res) => { //call api and get user address
                this.myaccount = res;
                this.reverseCartData = (this.myaccount['body']);
                this.spin = false;
                if (this.myaccount.body.length != 0 && entity_id != null) { //check is response exist 
                    this.checkBilling = this.reverseCartData[id].default_billing; //get default_billing
                    this.checkShipping = this.reverseCartData[id].default_shipping;//get default_shipping
                    let data = {};
                    let region = {};
                    data['country_code'] = this.reverseCartData[id].country_id;//add new filed in json object name country_code
                    var cId = find(this.counrtyName['body']['country'], data);//find selected country detail 
                    region['name'] = this.reverseCartData[id].region;
                    if (cId['country_region'].length > 0) {
                        rName = find(cId['country_region'], region);
                    } else {
                        rName = this.reverseCartData[id].region;
                    }

                    this.onChangeCountry(cId);
                    this.updateform = this._fb.group({ //fill form  data for edit
                        firstname: [this.reverseCartData[id].firstname, Validators.required],
                        lastname: [this.reverseCartData[id].lastname, Validators.required],
                        city: [this.reverseCartData[id].city, Validators.required],
                        company: [this.reverseCartData[id].company],
                        telephone: [this.reverseCartData[id].telephone, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
                        fax: [this.reverseCartData[id].fax],
                        street: [this.reverseCartData[id].street, Validators.required],
                        zip: [this.reverseCartData[id].postcode, Validators.required],
                        region: [rName, Validators.required],
                        countryid: [cId, Validators.required],
                        default_billing: [this.reverseCartData[id].default_billing],
                        default_shipping: [this.reverseCartData[id].default_shipping],
                        entity_id: [entity_id]
                    })
                }
            })
                .catch(err => {})
        } else {    //form use for add address
            this.spin = false;
            if (this.firstTime) { // use when first address will going to add (default_billing,default_shipping will true) 
                this.updateform = this._fb.group({
                    firstname: [firstname, Validators.required],
                    lastname: [lastname, Validators.required],
                    city: ['', Validators.required],
                    company: [''],
                    telephone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
                    fax: [''],
                    street: ['', Validators.required],
                    zip: ['', Validators.required],
                    region: ['', Validators.required],
                    countryid: ['', Validators.required],
                    default_billing: [1],
                    default_shipping: [1],
                    entity_id: ['']
                })
            } else {
                this.updateform = this._fb.group({
                    firstname: [firstname, Validators.required],
                    lastname: [lastname, Validators.required],
                    city: ['', Validators.required],
                    company: [''],
                    telephone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
                    fax: [''],
                    street: ['', Validators.required],
                    zip: ['', Validators.required],
                    region: ['', Validators.required],
                    countryid: ['', Validators.required],
                    default_billing: [0],
                    default_shipping: [0],
                    entity_id: ['']
                })
            }
        }
    }
    /*
     * function use for submit form
     */
    update(value: any) {
        let data = value;
        //create data for api use
        if (data['countryid']['country_region'].length > 0) {
            data['region_id'] = data['region']['region_id'] * 1;
            data['region'] = data['region']['region_id'] * 1;
        }
        data['countryid'] = data['countryid']['country_code'];
        if (data.default_billing) {
            data.default_billing = '1';//convert into string
        }
        else {
            data.default_billing = '0';//convert into string
        }
        if (data.default_shipping) {
            data.default_shipping = '1';//convert into string
        }
        else {
            data.default_shipping = '0';//convert into string
        }
        this.upd_spin = true;
        this._edit.updateAddress(data).then((res) => { //fire api for address/edit
            this.upd_spin = false;
            this.editaccount = res;
            if (this.editaccount.status === 1) {
                this._events.publish('api:savedaddress', true);
                //                this.viewCtrl.dismiss();
                this._toast.toast(data['entity_id'] ? "The address has been updated" : "The address has been saved", 3000, "top");
                //move to MySavedAddressPage 
                this._navCtrl.push(MySavedAddressPage, {'saveAdd': true}).then(() => {
                    const index = this.viewCtrl.index;
                    this._navCtrl.remove(index);
                });
            } else {
                this._toast.toast(JSON.parse(this.editaccount.message).error, 3000, "top");
            }
        })
            .catch(err => {
                this.upd_spin = false;
            });
    }
    presentPopover(myEvent: any) {
        let popover = this._popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent,
        });
    }

}