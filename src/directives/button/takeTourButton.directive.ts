import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericAnalytics } from './../../providers/genericAnalytics/genericAnalytics'

@Component({
    selector: 'btn-tour',
    templateUrl: 'buttonTakeTour.html'
})
export class ButtonTour {
    @Input() titleTour: string = "";
    @Input() colorTour: string = "primary";
    @Input() spinTour: boolean = false;
    @Input() validTour: boolean = false;
    @Input() idTour: string = "";
    @Input() classTour: string = "";
    @Input() analyticsAction: string = "";
    @Input() analyticsLabel: string = "";
    @Input() analyticsValue: number;
    @Output() onBtnClick = new EventEmitter();
    constructor(public _genericAnalytic:GenericAnalytics) {
    }
    onClick() {
        this._genericAnalytic.setTrackEventValue(this.analyticsAction, this.analyticsLabel, this.analyticsValue)
        this.onBtnClick.emit();
    }
}