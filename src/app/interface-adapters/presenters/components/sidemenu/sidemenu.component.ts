import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidemenu',
  imports: [],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  @Input() isCollapsed: boolean = false;
  @Output() toggleCollapse = new EventEmitter<void>();
}
