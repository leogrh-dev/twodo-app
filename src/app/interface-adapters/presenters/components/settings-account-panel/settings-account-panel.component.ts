import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { Apollo } from 'apollo-angular';

import { environment } from '../../../../../environments/environment';
import { UserStateService } from '../../../../core/services/user-state.service';
import { UPDATE_USER_ICON_MUTATION, REMOVE_USER_ICON_MUTATION } from '../../../../infrastructure/graphql/auth.graphql';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';

@Component({
  selector: 'app-settings-account-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzButtonModule, NzDropDownModule, ChangePasswordModalComponent],
  templateUrl: './settings-account-panel.component.html',
  styleUrls: ['./settings-account-panel.component.scss'],
})
export class SettingsAccountPanelComponent {
  private readonly userState = inject(UserStateService);
  private readonly apollo = inject(Apollo);
  
  readonly showChangePasswordModal = signal(false);

  readonly userName = this.userState.userName;
  readonly userEmail = this.userState.userEmail;
  readonly iconUrl = this.userState.iconUrl;

  readonly userNameValue = computed(() => this.userName());
  readonly userEmailValue = computed(() => this.userEmail());
  readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase());

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
    await this.apollo.mutate({
      mutation: UPDATE_USER_ICON_MUTATION,
      variables: { input: { url } },
    }).toPromise();

    this.userState.updateIconUrl(url);
  }

  async removeIcon() {
    const currentUrl = this.iconUrl();
    if (!currentUrl) return;

    await this.apollo.mutate({
      mutation: REMOVE_USER_ICON_MUTATION,
      variables: { currentUrl },
    }).toPromise();

    this.userState.updateIconUrl(null);
  }

  updateUserNameFromInput(name: string): void {
    this.userState.updateUserName(name);
  }

  openChangePasswordModal() {
    this.showChangePasswordModal.set(true);
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal.set(false);
  }
}