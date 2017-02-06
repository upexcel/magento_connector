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
    @Input() action: string = "";
    @Input() label: string = "";
    @Input() value: number;
    @Output() onBtnClick = new EventEmitter();
    constructor(public _genericAnalytic:GenericAnalytics) {
    }
    onClick() {
        this._genericAnalytic.setTrackEventValue(this.action, this.label, this.value)
        this.onBtnClick.emit();
    }
}