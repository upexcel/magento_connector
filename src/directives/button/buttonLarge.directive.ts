import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GoogleAnalyticsEvents } from './../../googleAnalyst/googleAnalyst'

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
    @Input() category: string = "";
    @Input() action: string = "";
    @Input() label: string = "";
    @Input() value: number;
    @Input() newSession: boolean = false;
    @Output() onBtnClick = new EventEmitter();
    constructor() {
    }
    onClick() {
        GoogleAnalyticsEvents.trackEvent(this.category, this.action, this.label, this.value, this.newSession);
        this.onBtnClick.emit();
    }
}