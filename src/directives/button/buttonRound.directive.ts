import { Component, Input , Output, EventEmitter } from '@angular/core';
@Component({
     selector: 'btn-round',
    templateUrl: 'button.html'
})
export class Button {
    @Input() title: string="";
    @Input() color: string="primary";
    @Input() spin:boolean=false;
    @Input() valid:boolean=false;
    @Input() id:string="";
    @Input() class:string="";
    @Output() onBtnClick = new EventEmitter();
    constructor() {
    }
    onClick(){
      this.onBtnClick.emit();
    }
}
