import { Component, Input , Output, EventEmitter } from '@angular/core';
@Component({
     selector: 'btn-large',
    templateUrl: 'buttonLarge.html'
})
export class ButtonForLarge {
    @Input() titleForLarge: string;
    @Input() colorForLarge: string;
    @Input() spinForLarge:boolean;
    @Input() validForLarge:boolean;
    @Input() idForLarge:string;
    @Input() classForLarge:string;
    @Output() functionForLarge = new EventEmitter();
    constructor() {
    }
    onClick(){
      this.functionForLarge.emit();
    }
}