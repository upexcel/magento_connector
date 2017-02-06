import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericAnalytics } from './../../providers/genericAnalytics/genericAnalytics'

@Component({
    selector: 'btn-round',
    templateUrl: 'button.html'
})
export class Button {
    @Input() title: string = "";
    @Input() color: string = "primary";
    @Input() spin: boolean = false;
    @Input() valid: boolean = false;
    @Input() id: string = "";
    @Input() class: string = "";
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
