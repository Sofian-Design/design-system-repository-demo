import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[fivraButtonLeadingIcon]',
})
export class FivraButtonLeadingIconDirective {
  public readonly elementRef = inject(ElementRef<HTMLElement>);
}

@Directive({
  selector: '[fivraButtonTrailingIcon]',
})
export class FivraButtonTrailingIconDirective {
  public readonly elementRef = inject(ElementRef<HTMLElement>);
}
