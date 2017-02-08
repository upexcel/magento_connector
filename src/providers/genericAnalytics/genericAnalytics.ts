import { Injectable } from '@angular/core';
import { GoogleAnalyticsEvents } from './../../analytics/analytics'

@Injectable()
export class GenericAnalytics {
    type: string;
    constructor() {
    }
    addAnalytics(eventType) {
        this.type = eventType;
        if (eventType == "googleAnalytics") {
            GoogleAnalyticsEvents.SetgoogleAnalytics();
        }
    }
    setUserId(id) {
        if (this.type == "googleAnalytics") {
            GoogleAnalyticsEvents.UserId(id);
        }
    }
    setTrackEventValue(action, label?, value?) {
        if (this.type == "googleAnalytics") {
            GoogleAnalyticsEvents.trackEvent(action, label, value);
        }
    }
    setAppVersion(appVersion) {
        if (this.type == "googleAnalytics") {
            GoogleAnalyticsEvents.setAppVersion(appVersion)
        }
    }
    setTrackView(title) {
        if (this.type == "googleAnalytics") {
            GoogleAnalyticsEvents.trackView(title);
        }
    }
}
