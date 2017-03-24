import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
import { Storage } from '@ionic/storage';
import { ActionSheetController } from 'ionic-angular';
import { ToastService } from './../../providers/toast-service/toastService';
import { WishListModel } from './../../model/wishList/wishList';
@Injectable()
export class WishListService {
    constructor(public _wishList: WishListModel, private _toast: ToastService, public _actionSheetCtrl: ActionSheetController, public local: Storage) { }
    resetFilterData() {
    }
    getWishListData(data1) {
        let dataOfRes: any = [];
        let data = {};
        this._wishList.getWishList(data1).then((response) => {
            forEach(response.body.wishlist, (value, key) => {
                if (value) {
                    if (value['bundle_option']) {
                        value["options"] = value.bundle_option;
                    }
                    else if (value['super_attribute']) {
                        value["options"] = value.bundle_option;
                    } else if (value['link']) {
                        value["options"] = value.bundle_option;
                    } else if (value["super_group"]) {
                        value["options"] = value.bundle_option;
                    } else {

                    }
                    value["entity_id"] = value.productId;
                    data["media_images"] = ["assets/image/default.jpg"];
                    value['data']=data

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
                    if (value.data.entity_id == list.data.entity_id) {
                        match = true;
                    }
                    response.push(value)
                })
                if (!match) {
                    this._wishList.addWishlist(apiData).then((res) => {
                        list["wishlist_id"] = res.body["wishlist_id"];
                        list["secret"] = apiData["secret"];
                        response.push(list);
                        this.local.set("wishList", response);
                        this._toast.toast("Your wishList is updated", 3000);
                    });
                } else {
                    this.deleteProductWishList(list, true);
                }
            } else {
                this._wishList.addWishlist(apiData).then((res) => {
                    list["wishlist_id"] = res.body["wishlist_id"];
                    list["secret"] = apiData["secret"];
                    this.local.set("wishList", [list]);
                    this._toast.toast("Your wishList is updated", 3000);
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
                                    if (value && value.data.entity_id == data.data.entity_id) {
                                        this._wishList.deleteWishlist({ "secret": value.secret, "itemId": value.wishlist_id }).then((deleteRes) => {
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
                        if (value && value.data.entity_id == data.data.entity_id) {
                            this._wishList.deleteWishlist({ "secret": value.secret, "itemId": value.wishlist_id }).then((deleteRes) => {
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
