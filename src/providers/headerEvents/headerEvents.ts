import {Injectable} from '@angular/core';
@Injectable()
export class EventService {
    cartCounter: number = 0;
    wishList: number = 0;
    constructor() {
    }
    getCartCounter() {
        return this.cartCounter;
    }
    setCartCounter(data) {
        this.cartCounter = data;
    }

    getWishListConuter() {
        return this.wishList;
    }
    setWishList(data) {
        this.wishList = data;
    }
}
