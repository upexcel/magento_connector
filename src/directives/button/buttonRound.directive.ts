import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GoogleAnalyticsEvents } from './../../analytice/analytice'

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
