/**
 * Show/Hide header based on page's scroll position.
 */
import {Directive, ElementRef, Renderer, Input} from '@angular/core';
import {Platform} from 'ionic-angular';

declare let $: any;
@Directive({
    selector: '[header-scroller]'
})
export class HeaderScroller {
    scrollToTop = 0;
    @Input('header-scroller') value: string;
    /**
     * @var number Distance from page top to trigger the hide/show functionality.
     */
    protected _topTriggeringDistance: number = 150;

    /**
     * @var HTMLElement Content element (<ion-content>).
     */
    protected _el: any;

    /**
     * Initializes.
     *
     * @param el ElementRef Directive's selector.
     * @return void
     */
    constructor(private _platform: Platform, private renderer: Renderer, el: ElementRef) {
        this._el = el.nativeElement;
    }

    /**
     * Binds the scroller.
     *
     * @return void
     */
    ngOnInit() {
        this._bindScroller(this._el.children[1]);
    }

    /**
     * Listen to scroll events in <scroll-content> component.
     *
     * @param el HTMLElement Scroller element (<scroll-content>).
     * @return void
     */

    protected _bindScroller(el): void {
        this.renderer.listen(el, 'scroll', (event) => {
            // Do something with 'event'
            $('.header').css(top);
            //find scroll possition 
            if (event.target.scrollTop < this.scrollToTop && ((this.scrollToTop - event.target.scrollTop) > 50 || $('.header').css('top') == '0px')) {
                // set header on top
                $('.header').css('top', '0px');
                if (event.target.scrollTop > this._topTriggeringDistance && $('.header').css('top') == '0px') {
//                    $('.footer').css({'transition': 'top .5s', '-webkit-transition': 'bottom .5s', 'bottom': -56});
                    $('.scroll-content').css('margin-bottom', '0px !important');
                }
//                if (this.value != "PAGES") {
//                    setTimeout(() => {
//                        $('.footer').css('bottom', '0px');
//                    }, 3000);
//                }
                if (this._platform.is('android')) {
                    $('.scroll-content').css('margin-top', '56px !important');
                }
                this.scrollToTop = event.target.scrollTop;
            }//find scroll possition 
            else if (event.target.scrollTop > this.scrollToTop) {
                if (event.target.scrollTop > this._topTriggeringDistance && $('.header').css('top') == '0px') {
                    /**
* @var number Animation transition, in seconds, for showing/hiding the header.
*/
                    if (this._platform.is('ios')) {
                        // This will only print when on iOS
                        $('.header').css({'transition': 'top .5s', '-webkit-transition': 'top .5s', 'top': -65});
                    } else {
                        $('.footer').css('bottom', '0px');
                        $('.header').css({'transition': 'top .5s', '-webkit-transition': 'top .5s', 'top': -60});
                        /**
          * @var number Animation transition, in seconds, for showing/hiding the margin-top scroll in android.
          */
                        $('.scroll-content').css({'transition': 'margin-top .5s', '-webkit-transition': 'margin-top .5s', 'margin-top': '0px !important'});
//                             if (this.value != "PAGE") {
//                            $('.scroll-content').css({'transition': 'margin-bottom .5s', '-webkit-transition': 'margin-bottom .5s', 'margin-bottom': '56px !important'});
//                        }
                    }
                }
                this.scrollToTop = event.target.scrollTop;

            }

        })

    }
}