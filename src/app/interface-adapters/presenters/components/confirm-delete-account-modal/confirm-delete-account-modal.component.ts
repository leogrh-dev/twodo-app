import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Apollo } from 'apollo-angular';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { DELETE_ACCOUNT_MUTATION } from '../../../../infrastructure/graphql/auth.graphql';
import { UserStateService } from '../../../../core/services/user-state.service';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-confirm-delete-account-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzButtonModule, NzPopconfirmModule,],
  templateUrl: './confirm-delete-account-modal.component.html',
  styleUrls: ['./confirm-delete-account-modal.component.scss']
})
export class ConfirmDeleteAccountModalComponent {
  @Output() close = new EventEmitter<void>();

  emailValue = '';
  readonly isLoading = signal(false);
  readonly currentUserEmail: string;

  constructor(
    private readonly apollo: Apollo,
    private readonly userState: UserStateService,
    private readonly notification: NzNotificationService
  ) {
    this.currentUserEmail = this.userState.userEmail();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

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