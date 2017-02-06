import { GoogleAnalytics } from 'ionic-native';
export class GoogleAnalyticsEvents {
    static trackEvent(category?, action?, label?, value?, newSession?) {
        if (GoogleAnalytics) {
            GoogleAnalytics.trackEvent(category, action, label, value, newSession).then((res) => {
                console.log('set', res);
            }).catch((err) => {
                console.log('err', err);
            })
        };
        //        return null;
    }

}
