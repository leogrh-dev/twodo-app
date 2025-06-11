import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PrimeNgModule } from '../../../../frameworks/ui/primeng/primeng.module';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, PrimeNgModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

}
