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
    static setAppVersion(appVersion) {
        if (GoogleAnalytics) {
            GoogleAnalytics.setAppVersion(appVersion).then((res) => {
            }).catch((err) => {
            })
        }
    }
    static UserId(id) {
        if (GoogleAnalytics) {
            GoogleAnalytics.setUserId(id).then((res) => {
            }).catch((err) => {
            })
        }
    }
    static trackView(title) {
        if (GoogleAnalytics) {
            GoogleAnalytics.trackView(title).then((res) => {
            }).catch((err) => {
            })
        }
    }

}
