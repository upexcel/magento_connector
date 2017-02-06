import { GoogleAnalytics } from 'ionic-native';
export class GoogleAnalyticsEvents {
    static SetgoogleAnalytics() {
        console.log("user")
        GoogleAnalytics.debugMode();
        GoogleAnalytics.startTrackerWithId('UA-91423110-1').then(() => {
            GoogleAnalytics.enableUncaughtExceptionReporting(true)
                .then((_success) => {
                    console.log("success", _success)
                }).catch((_error) => {
                });
        });
    }
    static trackEvent(action?, label?, value?) {
        if (GoogleAnalytics) {
            GoogleAnalytics.trackEvent(action, label, value).then((res) => {
                console.log("action, label, value",action, label, value);
                console.log('set', res);
            }).catch((err) => {
                console.log('err', err);
            })
        };
        //        return null;
    }

}
