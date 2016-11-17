import { Injectable }    from '@angular/core';
import { Platform} from 'ionic-angular';
import { Toast } from 'ionic-native';
@Injectable()
export class ToastService {
    constructor(private platform:Platform) {
      this.platform=platform;
    }
    toast(message?:string, duration?:any, position?:string) {
        if (this.platform.is('cordova')) {
          Toast.show(message, duration, 'bottom').subscribe(
            toast => {
            });
        } else {
          console.log("please run on a device");
        }
    }
}
