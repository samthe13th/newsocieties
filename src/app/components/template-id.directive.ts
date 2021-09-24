import { Directive, TemplateRef, Input } from '@angular/core';

@Directive({
  selector: '[templateId]'
})
export class TemplateIdDirective {
  constructor(public templateRef: TemplateRef<any>) {
    console.log('init template id')
  }

  @Input() templateId: string;
}