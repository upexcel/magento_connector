import { GoogleAnalytics } from 'ionic-native';
export class GoogleAnalyticsEvents {
    static SetgoogleAnalytics() {
        GoogleAnalytics.debugMode();
        GoogleAnalytics.startTrackerWithId('UA-91423110-1').then(() => {
            GoogleAnalytics.enableUncaughtExceptionReporting(true)
                .then((_success) => {
                }).catch((_error) => {
                });
        });
    }
    static trackEvent(action?, label?, value?) {
        if (GoogleAnalytics) {
            GoogleAnalytics.trackEvent(action, label, value).then((res) => {
            }).catch((err) => {
            })
        };
        //        return null;
    }
    static trackView(title, campaignUrl, newSession?){
        if (GoogleAnalytics) {
            GoogleAnalytics.trackView(title, campaignUrl, newSession).then((res) => {
            }).catch((err) => {
            })
        }
    }

}
