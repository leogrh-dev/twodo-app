import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-main-toolbar',
  standalone: true,
  templateUrl: './main-toolbar.component.html',
  styleUrl: './main-toolbar.component.scss',
  imports: [
    CommonModule,
    NzToolTipModule
  ],
})
export class MainToolbarComponent {
  @Input() isCollapsed: boolean = false;
  @Output() toggleSidemenu = new EventEmitter<void>();
}
