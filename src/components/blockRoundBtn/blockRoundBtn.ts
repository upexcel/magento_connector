import { Component, Input, OnInit } from '@angular/core';
import { Events } from 'ionic-angular';
@Component({
    selector: 'block-round-btn',
    templateUrl: 'blockRoundBtn.html'
})
export class BlockRoundBtn implements OnInit {
    @Input() color: string="primary";
    
    constructor() {
       
    }
    ngOnInit() {
       
    }
    sendClick(){
        console.log("Button is clicked");
    }
   
}