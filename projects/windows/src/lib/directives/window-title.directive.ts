import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[boxtitle]'
})
export class WindowTitleComponent { 
    constructor(public template: TemplateRef<any>) {}
}
