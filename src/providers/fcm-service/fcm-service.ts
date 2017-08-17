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
        console.log("iniit call")
        this.firebase.getToken().then((token) => {
            this.fcmToken = token;
            console.log("this.fcmToken",this.fcmToken)
        }).catch(error => console.error('Error getting token', error));
        this.firebase.onTokenRefresh().subscribe((token: string) => {
            this.fcmToken = token;
        });
    }
    saveFCMTokenOnServer() {
        console.log("saveFCMTokenOnServer",this.fcmToken); 
        setTimeout(() => {
            if (this.fcmToken) {
                this._apiService.api('push/saveToken', {"app_token": this.fcmToken});
            }
        }, 2000)
    }
}