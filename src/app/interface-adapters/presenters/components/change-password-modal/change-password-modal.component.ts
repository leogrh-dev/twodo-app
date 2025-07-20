// ======================
// Imports
// ======================
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule],
})
export class ChangePasswordModalComponent {
  // ======================
  // Outputs
  // ======================
  @Output() close = new EventEmitter<void>();

  // ======================
  // Injeções e dependências
  // ======================
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NzNotificationService);

  // ======================
  // Estado e sinais
  // ======================
  passwordVisible = signal(false);
  confirmVisible = signal(false);
  isLoading = signal(false);
  passwordStrength = signal(0);
  passwordChecks = signal({
    length: false,
    letters: false,
    numbers: false,
    special: false,
  });

  // ======================
  // Formulário reativo
  // ======================
  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  // ======================
  // Métodos de exibição de senha
  // ======================
  togglePasswordVisibility() {
    this.passwordVisible.update(v => !v);
  }

  toggleConfirmVisibility() {
    this.confirmVisible.update(v => !v);
  }

  // ======================
  // Validação da nova senha
  // ======================
  checkPasswordStrength() {
    const pwd = this.passwordForm.get('newPassword')?.value || '';
    const checks = {
      length: pwd.length >= 10,
      letters: /[a-zA-Z]/.test(pwd),
      numbers: /\d/.test(pwd),
      special: /[^a-zA-Z0-9]/.test(pwd),
    };
    this.passwordChecks.set(checks);
    const passed = Object.values(checks).filter(Boolean).length;
    this.passwordStrength.set(passed);
  }

  // ======================
  // Envio do formulário
  // ======================
  submit() {
    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      this.notification.warning('Erro', 'Preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.notification.warning('Erro', 'A nova senha e a confirmação não coincidem.');
      return;
    }

    const checks = this.passwordChecks();
    const validStrength = [checks.length, checks.letters, checks.numbers, checks.special].filter(Boolean).length >= 3;
    if (!validStrength) {
      this.notification.warning('Senha fraca', 'Sua senha deve atender a pelo menos 3 critérios de segurança.');
      return;
    }

    this.isLoading.set(true);

    this.authService.verifyPassword(currentPassword).subscribe({
      next: (isValid) => {
        if (!isValid) {
          this.notification.error('Senha atual incorreta', 'Verifique sua senha atual.');
          this.isLoading.set(false);
          return;
        }

        this.authService.updatePassword(newPassword).subscribe({
          next: () => {
            this.notification.success('Senha atualizada', 'Sua senha foi alterada com sucesso.');
            this.isLoading.set(false);
            this.close.emit();
          },
          error: () => {
            this.notification.error('Erro', 'Não foi possível atualizar sua senha.');
            this.isLoading.set(false);
          },
        });
      },
      error: () => {
        this.notification.error('Erro', 'Não foi possível validar sua senha atual.');
        this.isLoading.set(false);
      }
    });
  }

  // ======================
  // Ações ao clicar fora do modal
  // ======================
  onBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-backdrop')) {
      this.resetForm();
      this.close.emit();
    }
  }

  // ======================
  // Reset do formulário
  // ======================
  resetForm() {
    this.passwordForm.reset();
    this.passwordStrength.set(0);
    this.passwordChecks.set({
      length: false,
      letters: false,
      numbers: false,
      special: false,
    });
    this.passwordVisible.set(false);
    this.confirmVisible.set(false);
    this.isLoading.set(false);
  }
}