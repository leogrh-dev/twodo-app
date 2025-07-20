import { Component, OnDestroy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { Apollo } from 'apollo-angular';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { UserStateService } from '../../../../core/services/user-state.service';
import { AuthService } from '../../../../core/services/auth.service';
import {
  UPDATE_USER_ICON_MUTATION,
  REMOVE_USER_ICON_MUTATION,
} from '../../../../infrastructure/graphql/auth.graphql';

import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { ConfirmDeleteAccountModalComponent } from '../confirm-delete-account-modal/confirm-delete-account-modal.component';

@Component({
  selector: 'app-settings-account-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzDropDownModule,
    ChangePasswordModalComponent,
    ConfirmDeleteAccountModalComponent
  ],
  templateUrl: './settings-account-panel.component.html',
  styleUrls: ['./settings-account-panel.component.scss'],
})
export class SettingsAccountPanelComponent implements OnDestroy {
  readonly showChangePasswordModal = signal(false);
  readonly showDeleteModal = signal(false);

  readonly userNameValue = computed(() => this.userState.name());
  readonly userEmailValue = computed(() => this.userState.email());
  readonly userInitial = computed(() => this.userState.initial());
  readonly iconUrl = computed(() => this.userState.iconUrl());

  private nameInput$ = new Subject<string>();
  private nameInputSub: Subscription;

  constructor(
    private readonly userState: UserStateService,
    private readonly apollo: Apollo,
    private readonly authService: AuthService,
    private readonly notification: NzNotificationService
  ) {
    this.nameInputSub = this.nameInput$
      .pipe(debounceTime(3000))
      .subscribe((name) => this.saveUserName(name));
  }

  ngOnDestroy(): void {
    this.nameInputSub.unsubscribe();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(environment.uploadUri, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    await this.updateUserIcon(data.url);
  }

  async updateUserIcon(url: string) {
    await this.apollo
      .mutate({
        mutation: UPDATE_USER_ICON_MUTATION,
        variables: { input: { url } },
      })
      .toPromise();

    this.userState.updateIconUrl(url);
  }

  async removeIcon() {
    const currentUrl = this.iconUrl();
    if (!currentUrl) return;

    await this.apollo
      .mutate({
        mutation: REMOVE_USER_ICON_MUTATION,
        variables: { currentUrl },
      })
      .toPromise();

    this.userState.updateIconUrl(null);
  }

  updateUserNameFromInput(name: string): void {
    const trimmed = name.slice(0, 50);
    this.userState.updateUserName(trimmed);
    this.nameInput$.next(trimmed);
  }

  saveUserName(name: string): void {
    const trimmed = name.trim();

    if (!trimmed) {
      this.notification.warning('Nome inválido', 'Digite um nome válido.');
      return;
    }

    this.authService.updateUserName(trimmed).subscribe({
      next: () => {
        this.userState.updateUserName(trimmed);
        this.notification.success('Nome atualizado', 'Seu nome foi alterado com sucesso.');
      },
      error: () => {
        this.notification.error('Erro', 'Não foi possível atualizar o nome.');
      },
    });
  }

  openChangePasswordModal() {
    this.showChangePasswordModal.set(true);
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal.set(false);
  }

  openDeleteModal() {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
  }
}