import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericAnalytics } from './../../providers/genericAnalytics/genericAnalytics'

@Component({
    selector: 'btn-large',
    templateUrl: 'buttonLarge.html'
})
export class ButtonForLarge {
    @Input() titleForLarge: string = "";
    @Input() colorForLarge: string = "primary";
    @Input() spinForLarge: boolean = false;
    @Input() validForLarge: boolean = false;
    @Input() idForLarge: string = "";
    @Input() classForLarge: string = "";
    @Input() analyticsAction: string = "";
    @Input() analyticsLabel: string = "";
    @Input() analyticsValue: number;
    @Input() analyticsTitle: string = "";
    @Input() analyticsCampaignUrl: string;
    @Output() onBtnClick = new EventEmitter();
    constructor(public _genericAnalytic: GenericAnalytics) {
    }
    onClick() {
        this._genericAnalytic.setTrackEventValue(this.analyticsAction, this.analyticsLabel, this.analyticsValue);
        this._genericAnalytic.setTrackView(this.analyticsTitle, this.analyticsCampaignUrl);
        this.onBtnClick.emit();
    }
}