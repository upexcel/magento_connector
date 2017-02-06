import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GenericAnalytics } from './../../providers/genericAnalytics/genericAnalytics'

@Component({
    selector: 'btn-full',
    templateUrl: 'buttonFull.html'
})
export class ButtonFull {
    @Input() titleFull: string = "";
    @Input() colorFull: string = "primary";
    @Input() spinFull: boolean = false;
    @Input() validFull: boolean = false;
    @Input() idFull: string = "";
    @Input() classFull: string = "";
    @Input() action: string = "";
    @Input() label: string = "";
    @Input() value: number;
    @Output() onBtnClick = new EventEmitter();
    constructor(public _genericAnalytic:GenericAnalytics) {
    }
    onClick() {
        this._genericAnalytic.setTrackEventValue(this.action, this.label, this.value);
        this.onBtnClick.emit();
    }
}

