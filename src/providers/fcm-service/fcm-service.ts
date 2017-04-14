import {
    Injectable
} from '@angular/core';
import {
    Storage
} from '@ionic/storage';
import {Firebase} from '@ionic-native/firebase';
import {ApiService} from './../../providers/api-service/api-service';
@Injectable()

export class fcmService {
    fcmToken: string;
    constructor(private firebase: Firebase, private _local: Storage, private _apiService: ApiService) {}
    initFCM() {
        this.firebase.getToken().then((token) => {
            console.log('token', token)
            this.fcmToken = token;
        }).catch(error => console.error('Error getting token', error));
        this.firebase.onTokenRefresh().subscribe((token: string) => {
            console.log('Refreshtoken', token)
            this.fcmToken = token;
        });
    }
    saveFCMTokenOnServer() {
        console.log('token', this.fcmToken)
        setTimeout(() => {
            if (this.fcmToken) {
                this._apiService.api('push/saveToken', {"app_token": this.fcmToken});
            }
        }, 2000)
    }
}