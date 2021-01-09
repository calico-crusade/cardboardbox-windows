import { Component, OnInit, ContentChild, ElementRef, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { WindowTitleComponent } from '../directives/window-title.directive';
import { WindowBodyComponent } from '../directives/window-body.directive';

@Component({
  selector: 'box-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {

    @Output('minimized') onMinimized = new EventEmitter();
    @Output('maximized') onMaximized = new EventEmitter();
    @Output('restored') onRestored = new EventEmitter();
    @Output('closed') onClosed = new EventEmitter();

    @ContentChild(WindowTitleComponent) title: WindowTitleComponent;
    @ContentChild(WindowBodyComponent) body: WindowBodyComponent;

    @Input() startX: string = undefined;
    @Input() startY: string = undefined;
    @Input() startWidth: string = undefined;
    @Input() startHeight: string = undefined;

    positions: number[];
    oldDimensions: number[] = [];

    active: boolean = false;
    state: ('minimized' | 'maximized' | 'closed' | 'normal') = 'normal';

    constructor(
        public element: ElementRef,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
    }

    ngAfterContentInt() {
        
    }

    getStyle(style: string, el: ElementRef = this.element) {
        return document.defaultView.getComputedStyle(el.nativeElement).getPropertyValue(style);
    }

    setStyle(style: string, value: any, el: ElementRef = this.element) {
        this.renderer.setStyle(el.nativeElement, style, value);
    }

    updatePosition() {
        this.oldDimensions = [
            this.getStyle('left'),
            this.getStyle('top'),
            this.element.nativeElement.offsetWidth,
            this.element.nativeElement.offsetHeight
        ];
    }
}
