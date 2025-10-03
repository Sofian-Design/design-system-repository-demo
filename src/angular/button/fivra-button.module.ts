import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FivraButtonComponent } from './fivra-button.component';
import {
  FivraButtonLeadingIconDirective,
  FivraButtonTrailingIconDirective,
} from './fivra-button.directives';

@NgModule({
  imports: [CommonModule],
  declarations: [FivraButtonComponent, FivraButtonLeadingIconDirective, FivraButtonTrailingIconDirective],
  exports: [FivraButtonComponent, FivraButtonLeadingIconDirective, FivraButtonTrailingIconDirective],
})
export class FivraButtonModule {}
