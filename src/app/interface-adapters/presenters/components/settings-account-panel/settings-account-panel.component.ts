import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth.service';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-settings-account-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
  ],
  templateUrl: './settings-account-panel.component.html',
  styleUrls: ['./settings-account-panel.component.scss'],
})
export class SettingsAccountPanelComponent {
  private readonly authService = inject(AuthService);

  userName = this.authService.getCurrentUser()?.name ?? '';
  userEmail = this.authService.getCurrentUser()?.email ?? '';

  profilePhotoUrl: string | null = null;

  saveName(): void {
    console.log('Salvar nome:', this.userName);
  }

  triggerDeleteAccount(): void {
    console.log('Abrir modal de exclusão de conta');
  }
}