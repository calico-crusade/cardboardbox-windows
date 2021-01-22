import { Component, ContentChildren, QueryList, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { WindowComponent } from './../window/window.component';

@Component({
  selector: 'box-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnDestroy {

    @ContentChildren(WindowComponent) windows: QueryList<WindowComponent>;
    @ViewChild('background') background: ElementRef;

    private mouseMove: any;
    private mouseMoveUp: any;

    private get index() {
        return this.getZIndex(this.background);
    }

    private get width() {
        return this.background.nativeElement.offsetWidth;
    }

    private get height() {
        return this.background.nativeElement.offsetHeight;
    }

    constructor(
        private renderer: Renderer2,
        private element: ElementRef
    ) { }

    ngOnDestroy(): void {
        this.mouseUpRelief();
    }

    mouseUpRelief(evt: any = null) {
        this.stopDrag(null, null, null);
        return null;
    }

    getStyle(style: string, el: ElementRef = this.element) {
        return document.defaultView.getComputedStyle(el.nativeElement).getPropertyValue(style);
    }

    setStyle(style: string, value: any, el: ElementRef = this.element) {
        this.renderer.setStyle(el.nativeElement, style, value);
    }

    getZIndex(element: ElementRef) {
        const index = parseInt(this.getStyle('z-index', element));
        return isNaN(index) ? 1 : index;
    }

    ngAfterViewInit() {

        const offset = 15;
        const windows = this.windows.toArray();

        for(let i = 0; i < windows.length; i++) {
            const window = windows[i];
            const zindex = this.index + i + 1;

            const el = window.element.nativeElement;

            const xOffset = window.startX || (offset * i) + 'px';
            const yOffset = window.startY || (offset * i) + 'px';

            this.setStyle('position', 'absolute', window.element);
            this.setStyle('top', yOffset, window.element);
            this.setStyle('left', xOffset, window.element);
            if (window.startWidth)
                this.setStyle('width', window.startWidth, window.element);
            if (window.startHeight)
                this.setStyle('height', window.startHeight, window.element);

            this.setStyle('z-index', zindex, window.element);

            this.resizable(el, window);
            this.draggable(el, window);

            if (i + 1 == windows.length)
                setTimeout(() => window.active = true, 0);

            el.addEventListener('mousedown', (e) => this.moveToFront(window), false);

            window.onMaximized.subscribe(() => {
                window.updatePosition();
                this.setStyle('width', '100%', window.element);
                this.setStyle('height', '100%', window.element);
                this.setStyle('top', '0', window.element);
                this.setStyle('left', '0', window.element);
                this.setStyle('display', 'block', window.element);
                window.state = 'maximized';
            });

            window.onMinimized.subscribe(() => {
                this.setStyle('display', 'none', window.element);
                window.state = 'minimized';
            });

            window.onClosed.subscribe(() => {
                window.state = 'closed';
            });

            window.onRestored.subscribe(() => {
                this.restoreWindow(window);
            });

        }
    }

    restoreWindow(window: WindowComponent, useOldPos: boolean = true) {
        window.state = 'normal';

        if (window.oldDimensions.length !== 4 || !useOldPos) {
            this.setStyle('display', 'block', window.element);
            this.setStyle('top', '15px', window.element);
            this.setStyle('left', '15px', window.element);
            this.setStyle('width', '50%', window.element);
            this.setStyle('height', '50%', window.element);
            return;
        }

        this.setStyle('display', 'block', window.element);
        this.setStyle('top', window.oldDimensions[1], window.element);
        this.setStyle('left', window.oldDimensions[0], window.element);
        this.setStyle('width', window.oldDimensions[2] + 'px', window.element);
        this.setStyle('height', window.oldDimensions[3] + 'px', window.element);
    }

    moveToFront(window: WindowComponent, doPositionCheck: boolean = false) {
        if (doPositionCheck) {
            const top = parseInt(this.getStyle('top', window.element), 10);
            const left = parseInt(this.getStyle('left', window.element), 10);
            const width = parseInt(this.width);
            const height = parseInt(this.height);

            if (this.getStyle('display', window.element) === 'none')
                this.setStyle('display', 'block', window.element);

            if (top < 0 || left < 0 || top > height || left > width) {
                this.restoreWindow(window, false);
            } 
        }

        const windows = this.windows.toArray();
        const wi = this.getZIndex(window.element);

        this.setStyle('z-index', this.index + windows.length, window.element);

        for(let i = 0; i < windows.length; i++) {
            const w = windows[i];
            
            const index = this.getZIndex(w.element);
            w.active = false;

            if (w == window || index < wi)
                continue;

            this.setStyle('z-index', index - 1, w.element);       
        }
        window.active = true;
    }

    //START - MOVING
    draggable(el: any, window: WindowComponent) {

        window.positions = [0, 0, 0, 0];
        const header = el.children[0].children[0];

        header.addEventListener('mousedown', (e) => this.initMoveDrag(e, el, window), false);
    }

    initMoveDrag(e: any, el: any, window: WindowComponent) {
        window.positions[2] = e.clientX;
        window.positions[3] = e.clientY;

        this.mouseMove = (e) => this.doMoveDrag(e, el, window);
        this.mouseMoveUp = (e) => this.stopDrag(e, el, window);
        document.documentElement.addEventListener('mousemove', this.mouseMove, false);
        document.documentElement.addEventListener('mouseup', this.mouseMoveUp, false);
    }

    doMoveDrag(e: any, el: any, window: WindowComponent) {

        if (e.buttons == 0) {
            this.stopDrag(e, el, window);
            return;
        }

        window.positions[0] = window.positions[2] - e.clientX;
        window.positions[1] = window.positions[3] - e.clientY;
        window.positions[2] = e.clientX;
        window.positions[3] = e.clientY;

        this.renderer.setStyle(el, 'top', (el.offsetTop - window.positions[1]) + 'px');
        this.renderer.setStyle(el, 'left', (el.offsetLeft  - window.positions[0]) + 'px');
    }

    //END - MOVING

    //START - RESIZING
    resizable(el: any, window: WindowComponent) {
        for(const child of el.children[0].children) {
            if (!child.classList.contains('grabber'))
                continue;
            
            const isLeft = child.classList.contains('left') ||
                           child.classList.contains('bottom-left-corner');

            child.addEventListener('mousedown', (e) => this.initResizeDrag(e, el, window, isLeft), false);
        }
    }

    initResizeDrag(e: any, el: any, window: WindowComponent, isLeft: boolean) {
        window.startX = e.clientX + 'px';
        window.startY = e.clientY + 'px';
        window.startWidth = parseInt(document.defaultView.getComputedStyle(el).width, 10) + 'px';
        window.startHeight = parseInt(document.defaultView.getComputedStyle(el).height, 10) + 'px';

        this.mouseMove = (e) => this.doResizeDrag(e, el, window, isLeft)
        this.mouseMoveUp = (e) => this.stopDrag(e, el, window);
        document.documentElement.addEventListener('mousemove', this.mouseMove, false);
        document.documentElement.addEventListener('mouseup', this.mouseMoveUp, false);
    }

    doResizeDrag(e: any, el: any, window: WindowComponent, isLeft: boolean) {

        if (e.buttons == 0) {
            this.stopDrag(e, el, window);
            return;
        }

        const width = parseInt(window.startWidth, 10);
        const height = parseInt(window.startHeight, 10);
        const x = parseInt(window.startX, 10);
        const y = parseInt(window.startY);


        if (isLeft && e.clientX < x) {
            const newWidth = (x - e.clientX) + width;
            this.renderer.setStyle(el, 'left', e.clientX + 'px');
            this.renderer.setStyle(el, 'width', newWidth + 'px');
        } else {
            this.renderer.setStyle(el, 'width', (width + e.clientX - x) + 'px');
        }

        this.renderer.setStyle(el, 'height', (height + e.clientY - y) + 'px');
    }
    //END - RESIZING

    stopDrag(e: any, el: any, window: WindowComponent) {
        if (!this.mouseMove && !this.mouseMoveUp)
            return;

        document.documentElement.removeEventListener('mousemove', this.mouseMove, false);
        document.documentElement.removeEventListener('mouseup', this.mouseMoveUp, false);

        this.mouseMove = undefined;
        this.mouseMoveUp = undefined;
    }
}
