import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';

import { countries, Country } from './countries';

@Component({
  selector: 'app-phone-input-with-ddi-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, NzSelectModule, NzInputModule],
  templateUrl: './phone-input-with-ddi-selector.component.html',
  styleUrl: './phone-input-with-ddi-selector.component.scss',
})
export class PhoneInputWithDdiSelectorComponent {
  // ==============================
  // Inputs e Outputs
  // ==============================

  @Input() control!: FormControl;
  @Output() phoneChange = new EventEmitter<string>();

  // ==============================
  // Estado interno
  // ==============================

  countries = countries;
  selectedCountry = countries.find(c => c.code === 'br')!;
  phoneNumber = '';

  // ==============================
  // Métodos auxiliares
  // ==============================

  /** Função de filtro para o dropdown de países */
  filterOption = (input: string, option: any): boolean => {
    return option.nzLabel.toLowerCase().includes(input.toLowerCase());
  };

  /** Retorna o tamanho mínimo para o número de telefone do país selecionado */
  getMinLength(): number {
    return this.selectedCountry.code === 'br' ? 10 : 7;
  }

  /** Retorna o tamanho máximo para o número de telefone do país selecionado */
  getMaxLength(): number {
    return this.selectedCountry.code === 'br' ? 11 : 15;
  }

  /** Atualiza valor do campo e valida erros */
  onInputChange(value?: string): void {
    const inputValue = value ?? this.phoneNumber;
    const rawPhone = inputValue.replace(/\D/g, '');

    const max = this.getMaxLength();
    this.phoneNumber = rawPhone.slice(0, max);

    const completePhone = `${this.selectedCountry.dial_code}${this.phoneNumber}`;
    const isValid = this.isPhoneValid();

    this.control.setValue(completePhone);

    if (!isValid && this.phoneNumber.length > 0) {
      const min = this.getMinLength();
      const max = this.getMaxLength();
      this.control.setErrors({
        phoneLength: {
          actual: this.phoneNumber.length,
          min,
          max,
          message: `Número deve ter entre ${min} e ${max} dígitos`,
        },
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

  /** Verifica se o telefone está no intervalo válido */
  isPhoneValid(): boolean {
    const length = this.phoneNumber.length;
    return length >= this.getMinLength() && length <= this.getMaxLength();
  }

  /** Placeholder exibido no input com base no país */
  getPlaceholder(): string {
    return this.selectedCountry.code === 'br' ? '(11) 99999-9999' : 'Número de telefone';
  }

  /** Formata o label do país no dropdown */
  countryLabel(country: Country): string {
    return `${country.name} (${country.dial_code})`;
  }

  /** Formata telefone para exibição (apenas BR por enquanto) */
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

  // ==============================
  // Eventos de teclado / colar
  // ==============================

  /** Previne entrada de caracteres inválidos */
  onKeyPress(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    if (allowedKeys.includes(event.key)) return;

    const currentLength = this.phoneNumber.replace(/\D/g, '').length;
    if (currentLength >= this.getMaxLength()) {
      event.preventDefault();
      return;
    }

    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  /** Previne colagem de texto não numérico */
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const numbersOnly = pastedText.replace(/\D/g, '');
    if (numbersOnly) {
      this.onInputChange(numbersOnly);
    }
  }

  // ==============================
  // Validações visuais
  // ==============================

  /** Retorna a mensagem de erro atual do telefone */
  getPhoneErrorMessage(): string {
    if (this.control.errors?.['phoneLength']) {
      return this.control.errors['phoneLength'].message;
    }
    return '';
  }

  /** Define se o erro deve ser exibido */
  shouldShowError(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched) && !!this.control.errors?.['phoneLength'];
  }
}