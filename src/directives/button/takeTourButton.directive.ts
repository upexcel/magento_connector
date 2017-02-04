import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GoogleAnalyticsEvents } from './../../googleAnalyst/googleAnalyst'

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
    @Input() category: string = "";
    @Input() action: string = "";
    @Input() label: string = "";
    @Input() value: number ;
    @Input() newSession: boolean = false;
    @Output() onBtnClick = new EventEmitter();
    constructor() {
    }
    onClick() {
        GoogleAnalyticsEvents.trackEvent(this.category, this.action, this.label, this.value, this.newSession);
        this.onBtnClick.emit();
    }
}