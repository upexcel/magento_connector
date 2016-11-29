import { Component, Input} from '@angular/core';
@Component({
     selector: 'btn',
    templateUrl: 'button.html'
})
export class Button {
    @Input() title: string;
    @Input() color: string;
    @Input() spin:boolean;
    @Input() valid:boolean;
    constructor() {
       this.onClick();
    }
    onClick(){
       console.log("eneter function"); 
       console.log(this.spin);
    }
}
