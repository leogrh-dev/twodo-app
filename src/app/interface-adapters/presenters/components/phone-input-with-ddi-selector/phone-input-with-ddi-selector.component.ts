import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormControl } from '@angular/forms';
import { countries, Country } from './countries';

@Component({
  selector: 'app-phone-input-with-ddi-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule, NzInputModule],
  templateUrl: './phone-input-with-ddi-selector.component.html',
  styleUrl: './phone-input-with-ddi-selector.component.scss',
})
export class PhoneInputWithDdiSelectorComponent {
  @Input() control!: FormControl;
  @Output() phoneChange = new EventEmitter<string>();

  countries = countries;
  selectedCountry = countries.find(c => c.code === 'br')!;
  phoneNumber = '';

  filterOption = (input: string, option: any): boolean => {
    return option.nzLabel.toLowerCase().includes(input.toLowerCase());
  };

  getMinLength(): number {
    return this.selectedCountry.code === 'br' ? 10 : 7;
  }

  getMaxLength(): number {
    return this.selectedCountry.code === 'br' ? 11 : 15;
  }

  onInputChange(value?: string) {
    const inputValue = value ?? this.phoneNumber;
    const rawPhone = inputValue.replace(/\D/g, '');

    const max = this.getMaxLength();
    this.phoneNumber = rawPhone.slice(0, max);

    const completePhone = `${this.selectedCountry.dial_code}${this.phoneNumber}`;
    const isValid = this.isPhoneValid();

    this.control.setValue(completePhone);

    console.log('%c[DEBUG] 📞 Input Change', 'color: #00c1ff; font-weight: bold;');
    console.log('→ Raw Phone:', rawPhone);
    console.log('→ Formatted for Display:', this.formatPhoneForDisplay(rawPhone));
    console.log('→ Complete Phone (with DDI):', completePhone);
    console.log('→ Is Valid:', isValid);
    console.log('→ Current FormControl Value:', this.control.value);
    console.log('→ Current Errors:', this.control.errors);

    if (!isValid && this.phoneNumber.length > 0) {
      const min = this.getMinLength();
      const max = this.getMaxLength();
      this.control.setErrors({
        phoneLength: {
          actual: this.phoneNumber.length,
          min: min,
          max: max,
          message: `Número deve ter entre ${min} e ${max} dígitos`
        }
      });
    } else if (isValid) {
      const currentErrors = this.control.errors;
      if (currentErrors && currentErrors['phoneLength']) {
        delete currentErrors['phoneLength'];
        this.control.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
      }
    }

    this.phoneChange.emit(completePhone);
  }


  isPhoneValid(): boolean {
    const min = this.getMinLength();
    const max = this.getMaxLength();
    const length = this.phoneNumber.length;

    return length >= min && length <= max;
  }

  getPlaceholder(): string {
    return this.selectedCountry.code === 'br' ? '(11) 99999-9999' : 'Número de telefone';
  }

  countryLabel(country: Country): string {
    return `${country.name} (${country.dial_code})`;
  }

  formatPhoneForDisplay(phone: string): string {
    const raw = phone.replace(/\D/g, '');
    if (this.selectedCountry.code === 'br') {
      const match = raw.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    return raw;
  }

  onKeyPress(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    if (allowedKeys.includes(event.key)) {
      return;
    }
    const currentLength = this.phoneNumber.replace(/\D/g, '').length;
    const maxLength = this.getMaxLength();

    if (currentLength >= maxLength) {
      event.preventDefault();
      return;
    }

    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const numbersOnly = pastedText.replace(/\D/g, '');
    if (numbersOnly) {
      this.onInputChange(numbersOnly);
    }
  }

  getPhoneErrorMessage(): string {
    if (this.control.errors?.['phoneLength']) {
      const error = this.control.errors['phoneLength'];
      return error.message;
    }
    return '';
  }

  shouldShowError(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched) && !!this.control.errors?.['phoneLength'];
  }
}