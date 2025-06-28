import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { AuthService } from '../../../../core/services/auth.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-sidemenu',
  imports: [
    CommonModule,
    NzToolTipModule,
    NzDropDownModule,
    ThemeSwitcherComponent,
],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  @Input() isCollapsed: boolean = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  userInitial: string;
  userName: string = 'Usuário';
  userEmail: string = '';

  constructor(private authService: AuthService){
    const user = this.authService.getCurrentUser();
    this.userInitial = user?.name?.charAt(0).toUpperCase() ?? 'U';
    this.userName = user?.name ?? 'Usuário';
    this.userEmail = user?.email ?? '';
  }
}
