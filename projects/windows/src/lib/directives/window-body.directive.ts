import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[body]',
})
export class WindowBodyComponent { 
    constructor(public template: TemplateRef<any>) {}
}
