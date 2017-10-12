import {Directive, ElementRef, Renderer, Input} from '@angular/core';
declare let $: any;
import {Platform} from 'ionic-angular';

@Directive({
    selector: '[shrink-header]',
    host: {
        '(ionScroll)': 'onContentScroll($event)'
    }
})
export class ShrinkHeader {
    @Input('shrink-header') value: string;
    header: any;
    headerHeight: any;
    translateAmt: any = 0;
    scrollToTop = 0;
    constructor(private _platform: Platform, public element: ElementRef, public renderer: Renderer) {

    }

    ngAfterViewInit() {
        this.header = document.getElementById(this.value);
        this.headerHeight = this.header.clientHeight;
    }

    onContentScroll(ev) {
        ev.domWrite(() => {
            this.updateHeader(ev);
        });
    }

    updateHeader(ev) {
        let amount;
        if (ev.scrollTop >= 0) {
            this.translateAmt = -ev.scrollTop / 4;
        } else {
            this.translateAmt = ev.scrollTop / 4;
        }
        if (this._platform.is('android')) {
            $('.scroll-content').css({'transition': 'margin-top .0s', '-webkit-transition': 'margin-top .0s', 'margin-top': 56 + this.translateAmt + 'px !important'});
        }
        //            this.renderer.setElementStyle(this.element.nativeElement.children[1], 'margin-top', amount + 'px !important');
        //            this.renderer.setElementStyle(this.element.nativeElement.children[1], 'webkitTransform', 'margin-top .5s');
        this.renderer.setElementStyle(this.header, 'webkitTransform', 'translate3d(0,' + this.translateAmt + 'px,0)');
        this.scrollToTop = ev.scrollTop;

    }


}
