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
    setTrackEventValue(action, label?, value?) {
        if (this.type == "googleAnalytics") {
            GoogleAnalyticsEvents.trackEvent(action, label, value);
        }
    }
    setTrackView(title, campaignUrl, newSession?) {
        if (this.type == "googleAnalytics") {
            GoogleAnalyticsEvents.trackView(title, campaignUrl, newSession);
        }
    }
}
