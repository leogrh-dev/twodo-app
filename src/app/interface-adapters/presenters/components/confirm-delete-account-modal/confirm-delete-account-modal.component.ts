import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Apollo } from 'apollo-angular';

import { DELETE_ACCOUNT_MUTATION } from '../../../../infrastructure/graphql/auth.graphql';
import { UserStateService } from '../../../../core/services/user-state.service';

@Component({
  selector: 'app-confirm-delete-account-modal',
  standalone: true,
  templateUrl: './confirm-delete-account-modal.component.html',
  styleUrls: ['./confirm-delete-account-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzPopconfirmModule
  ]
})
export class ConfirmDeleteAccountModalComponent {
  /** Evento de fechamento do modal */
  @Output() close = new EventEmitter<void>();

  /** E-mail digitado para confirmação */
  emailValue = '';

  /** Estado de carregamento do botão */
  readonly isLoading = signal(false);

  /** E-mail do usuário atual */
  readonly currentUserEmail: string;

  constructor(
    private readonly apollo: Apollo,
    private readonly userState: UserStateService,
    private readonly notification: NzNotificationService
  ) {
    this.currentUserEmail = this.userState.email();
  }

  /** Fecha o modal ao clicar fora */
  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

  /** Confirma a exclusão da conta se o e-mail estiver correto */
  async confirmDelete() {
    const email = this.emailValue.trim();

    if (email !== this.currentUserEmail) {
      this.notification.warning('Confirmação incorreta', 'Digite exatamente seu e-mail para confirmar.');
      return;
    }

    this.isLoading.set(true);

    try {
      await this.apollo.mutate({
        mutation: DELETE_ACCOUNT_MUTATION,
        variables: { input: { emailConfirmation: email } }
      }).toPromise();

      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    } catch {
      this.notification.error('Erro', 'Não foi possível excluir sua conta.');
    } finally {
      this.isLoading.set(false);
    }
  }
}