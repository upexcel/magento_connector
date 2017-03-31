import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
import {Storage} from '@ionic/storage';
import {ActionSheetController} from 'ionic-angular';
import {ToastService} from './../../providers/toast-service/toastService';
import {WishListModel} from './../../model/wishList/wishList';
import { homeProductsService } from './../../providers/homeproducts-service/homeproducts.service';
@Injectable()
export class WishListService {
    constructor(private _homeProductsService: homeProductsService, public _wishList: WishListModel, private _toast: ToastService, public _actionSheetCtrl: ActionSheetController, public local: Storage) {}
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
            this.local.set("wishList", dataOfRes);
        })
    }
    setWishListData(list, apiData) {
        this.local.get('wishList').then((res: any) => {
            var match = false;
            var response: any = [];
            if (res) {
                forEach(res, (value, key) => {
                    let entity_id = value.data.entity_id || value.entity_id
                    if (entity_id == list.data.entity_id) {
                        match = true;
                    }
                    response.push(value)
                })
                if (!match) {
                    this._homeProductsService.updateHomeProductWishlist(list.data.entity_id, true);
                    this._wishList.addWishlist(apiData).then((res) => {
                        list["wishlist_id"] = res.body["wishlist_id"];
                        list["secret"] = apiData["secret"];
                        response.push(list);
                        this.local.set("wishList", response);
                        this._toast.toast(list.data.name + " has been added to your wishlist", 3000);
                        this._homeProductsService.updateHomeProductWishlist(list.data.entity_id, res.body["wishlist_id"]);
                    });
                } else {
                    this.deleteProductWishList(list, true);
                }
            } else {
                this._homeProductsService.updateHomeProductWishlist(list.data.entity_id, true);
                this._wishList.addWishlist(apiData).then((res) => {
                    list["wishlist_id"] = res.body["wishlist_id"];
                    list["secret"] = apiData["secret"];
                    this.local.set("wishList", [list]);
                    this._toast.toast(list.data.name + " has been added to your wishlist", 3000);
                    this._homeProductsService.updateHomeProductWishlist(list.data.entity_id, res.body["wishlist_id"]);
                });
            }
        })
    }
    getWishList() {
        return new Promise((resolve, rejec) => {
            this.local.get('wishList').then((wishListData: any) => {
                if (!wishListData || !wishListData.length) {
                    //api coll 
                    //                  this.local.set("wishList", api variable);   
                    //                     resolve(api variable)
                }
                else {
                    resolve(wishListData);
                }
            })
        })
    }
    deleteProductWishList(data, actionSheetDelete?) {
        return new Promise((resolve, reject) => {
            if (!actionSheetDelete) {
                let actionSheet = this._actionSheetCtrl.create({
                    title: 'Delete',
                    buttons: [{
                        text: 'Yes',
                        handler: () => {
                            this.local.get('wishList').then((res: any) => {
                                forEach(res, (value, key) => {
                                    if (value && value.wishlist_id == data.wishlist_id) {
                                        this._homeProductsService.updateHomeProductWishlist(data.entity_id || data.data.entity_id, false);
                                        this._wishList.deleteWishlist({"secret": value.secret, "itemId": value.wishlist_id}).then((deleteRes) => {
                                            res.splice(key, 1);
                                            this.local.set("wishList", res);
                                            this._toast.toast("Your wishList is updated", 3000);
                                            resolve(res);
                                        });
                                    }
                                })
                            });
                        }
                    }, {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                    ]
                });
                actionSheet.present();
            } else {
                this.local.get('wishList').then((res: any) => {
                    forEach(res, (value, key) => {
                        let entity_id = value.data.entity_id || value.entity_id;
                        if (value && entity_id == data.data.entity_id) {
                            this._homeProductsService.updateHomeProductWishlist(data.data.entity_id, false);
                            this._wishList.deleteWishlist({"secret": value.secret, "itemId": value.wishlist_id}).then((deleteRes) => {
                                res.splice(key, 1);
                                this.local.set("wishList", res);
                                this._toast.toast("Your wishList is updated", 3000);
                                resolve(res);
                            });
                        }
                    })
                });
            }
        });
    }
}
