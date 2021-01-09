import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent  } from './container/container.component';
import { WindowComponent } from './window/window.component';
import { WindowBodyComponent } from './directives/window-body.directive';
import { WindowTitleComponent } from './directives/window-title.directive';

const COMPS = [
    ContainerComponent,
    WindowComponent,
    WindowBodyComponent,
    WindowTitleComponent
];

@NgModule({
  declarations: COMPS,
  imports: [
      CommonModule
  ],
  exports: COMPS
})
export class CardboardBoxWindowsModule { }
