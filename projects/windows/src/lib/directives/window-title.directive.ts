import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[title]'
})
export class WindowTitleComponent { 
    constructor(public template: TemplateRef<any>) {}
}
