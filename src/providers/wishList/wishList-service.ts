import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import forEach from 'lodash/forEach';
import {Storage} from '@ionic/storage';
import {ActionSheetController} from 'ionic-angular';
import {ToastService} from './../../providers/toast-service/toastService';

@Injectable()
export class WishListService {
    constructor(private _toast: ToastService, public _actionSheetCtrl: ActionSheetController, public local: Storage) {}
    resetFilterData() {
    }
    setWishListData(list) {
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
                    response.push(list);
                    this.local.set("wishList", response);
                } else {
                    this.deleteProductWishList(list, true);
                }
            } else {
                this.local.set("wishList", [list]);
            }
        })
        this._toast.toast("Your wishList is updated", 3000);
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
                                        res.splice(key, 1);
                                        this.local.set("wishList", res);
                                        resolve(res);
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
                            res.splice(key, 1);
                            this.local.set("wishList", res);
                            resolve(res);
                        }
                    })
                });
            }
        });
    }
}
