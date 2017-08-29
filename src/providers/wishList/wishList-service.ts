import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
import {Storage} from '@ionic/storage';
import {ActionSheetController, Events} from 'ionic-angular';
import {ToastService} from './../../providers/toast-service/toastService';
import {WishListModel} from './../../model/wishList/wishList';
import {AppDataConfigService} from './../../providers/appdataconfig/appdataconfig';
import {HomeProducts} from '../../model/home/homeProducts';

@Injectable()
export class WishListService {
    seviceData: any;
    constructor(private _events: Events, private _dataConfigService: AppDataConfigService, private _homeProductsService: HomeProducts, public _wishList: WishListModel, private _toast: ToastService, public _actionSheetCtrl: ActionSheetController, public local: Storage) {}
    resetFilterData() {
    }
    getWishListData(data1) {
        let dataOfRes: any = [];
        let data = {};
        this._wishList.getWishList(data1).then((response) => {
            forEach(response.body.wishlist, (value, key) => {
                if (value) {
                    data = {};
                    if (value["super_group"]) {
                        value["super_attribute"] = value.super_group;
                    } else {

                    }
                    value["entity_id"] = value.productId;
                    data["media_images"] = value.media_images;
                    data["short_description"] = value.short_description;
                    data["name"] = value.name;
                    data["sku"] = value.sku;
                    value['data'] = data

                    dataOfRes.push(value);
                }
            })
            this.seviceData = dataOfRes;
            this._events.publish('wishList:length', this.seviceData ? this.seviceData.length : 0);
        })
    }
    //synchronize wishlist api data with local
    setWishListData(list, apiData) {
        var match = false;
        if (this.seviceData && this.seviceData.length > 0) {
            forEach(this.seviceData, (value, key) => {
                let entity_id = value.data.entity_id || value.entity_id;
                if (entity_id == list.data.entity_id) {
                    match = true;
                }
            })
            if (!match) {
                this.seviceData.unshift(list);
                this._events.publish('wishList:length', this.seviceData ? this.seviceData.length : 0);
                this._toast.toast(list.data.name + " has been added to your wishlist", 3000);
                this._wishList.addWishlist(apiData).then((res) => {
                    this.updateWishlistDataLocal(list.data.entity_id, res.body["wishlist_id"]);
                    this._homeProductsService.updateHomeProductWishlist(list.data.entity_id, res.body["wishlist_id"]);
                    this._dataConfigService.updateDataInServiceForWishlist(list.data.entity_id, res.body["wishlist_id"]);
                });
            } else {
                this.deleteProductWishList(list, true);
            }
        } else {
            this.seviceData = [list];
            this._events.publish('wishList:length', this.seviceData ? this.seviceData.length : 0);
            this._toast.toast(list.data.name + " has been added to your wishlist", 3000);
            this._wishList.addWishlist(apiData).then((res) => {
                this.updateWishlistDataLocal(list.data.entity_id, res.body["wishlist_id"])
                this._homeProductsService.updateHomeProductWishlist(list.data.entity_id, res.body["wishlist_id"]);
                this._dataConfigService.updateDataInServiceForWishlist(list.data.entity_id, res.body["wishlist_id"]);
            });
        }
    }
    getWishList() {
        return new Promise((resolve, reject) => {
            resolve(this.seviceData)
        })
    }
    /**
    *deleteProductWishList
    *
    *delete product from wishlist
    **/
    deleteProductWishList(data, actionSheetDelete?) {
        return new Promise((resolve, reject) => {
            if (!actionSheetDelete) {
                let actionSheet = this._actionSheetCtrl.create({
                    title: 'Delete',
                    buttons: [{
                        text: 'Yes',
                        handler: () => {
                            forEach(this.seviceData, (value, key) => {
                                if (value && value.wishlist_id == data.wishlist_id) {
                                    this._toast.toast(data.data.name + " has been removed from your wishlist", 3000);
                                    this._wishList.deleteWishlist({"itemId": value.wishlist_id}).then((deleteRes) => {
                                        this._homeProductsService.updateHomeProductWishlist(data.entity_id || data.data.entity_id, false);
                                        this._dataConfigService.updateDataInServiceForWishlist(data.entity_id || data.data.entity_id, false);
                                    });
                                    this.seviceData.splice(key, 1);
                                    this._events.publish('wishList:length', this.seviceData ? this.seviceData.length : 0);
                                    resolve(this.seviceData);
                                }
                            })
                        }
                    }, {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                        }
                    }
                    ]
                });
                actionSheet.present();
            } else {
                forEach(this.seviceData, (value, key) => {
                    let entity_id = value.data.entity_id || value.entity_id;
                    if (value && entity_id == data.data.entity_id) {
                        this._toast.toast(data.data.name + " has been removed from your wishlist", 3000);
                        this._wishList.deleteWishlist({"itemId": value.wishlist_id}).then((deleteRes) => {
                            this._homeProductsService.updateHomeProductWishlist(data.data.entity_id, false);
                            this._dataConfigService.updateDataInServiceForWishlist(data.data.entity_id, false);
                        });
                        this.seviceData.splice(key, 1);
                        this._events.publish('wishList:length', this.seviceData ? this.seviceData.length : 0);
                        resolve(this.seviceData);
                    }
                })
            }
        });
    }
    /**
    *updateWishlistDataLocal
    *
    *update wish list data from local
    **/
    updateWishlistDataLocal(entityId, wishistId) {
        forEach(this.seviceData, (value, key) => {
            let entity_id = value.data.entity_id || value.entity_id;
            if (value && entity_id == entityId) {
                value["wishlist_id"] = wishistId;
            }
        })
    }
}
