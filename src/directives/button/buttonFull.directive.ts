import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GoogleAnalyticsEvents } from './../../analytice/analytice'

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
    @Input() category: string = "";
    @Input() action: string = "";
    @Input() label: string = "";
    @Input() value: number;
    @Input() newSession: boolean = false;
    @Output() onBtnClick = new EventEmitter();
    constructor() {
    }
    onClick() {
        GoogleAnalyticsEvents.trackEvent(this.category, this.action, this.label, this.value, this.newSession)
        this.onBtnClick.emit();
    }
}

