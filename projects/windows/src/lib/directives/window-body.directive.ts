import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[boxbody]',
})
export class WindowBodyComponent { 
    constructor(public template: TemplateRef<any>) {}
}
