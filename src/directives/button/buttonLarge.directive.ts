import { Component, Input , Output, EventEmitter } from '@angular/core';
@Component({
     selector: 'btn-large',
    templateUrl: 'buttonLarge.html'
})
export class ButtonForLarge {
    @Input() titleForLarge: string="";
    @Input() colorForLarge: string="primary";
    @Input() spinForLarge:boolean=false;
    @Input() validForLarge:boolean=false;
    @Input() idForLarge:string="";
    @Input() classForLarge:string="";
    @Output() onBtnClick = new EventEmitter();
    constructor() {
    }
    onClick(){
      this.onBtnClick.emit();
    }
}