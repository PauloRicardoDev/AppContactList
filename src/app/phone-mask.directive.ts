import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective {

  private phonePattern = /(\d{2})(\d{5})(\d{4})/;
  private invalidPattern = /(.)\1{2,}/; // Regex para detectar sequências repetidas

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const numericValue = value.replace(/\D/g, '');
    if (this.isValidNumber(numericValue)) {
      this.el.nativeElement.value = this.formatPhone(numericValue);
    } else {
      // Remove invalid characters from the input if necessary
      this.el.nativeElement.value = this.formatPhone(numericValue.replace(this.invalidPattern, ''));
    }
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    const numericValue = value.replace(/\D/g, '');
    if (this.isValidNumber(numericValue)) {
      this.el.nativeElement.value = this.formatPhone(numericValue);
    }
  }

  private formatPhone(value: string): string {
    const match = value.match(this.phonePattern);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  }

  private isValidNumber(value: string): boolean {
    // Verifica se a entrada contém sequências repetidas do mesmo número
    return !this.invalidPattern.test(value);
  }
}
