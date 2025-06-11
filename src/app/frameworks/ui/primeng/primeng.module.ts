// src/app/frameworks/ui/primeng/primeng.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ToolbarModule,
    ToastModule,
    DialogModule,
  ],
  exports: [
    ButtonModule,
    InputTextModule,
    CardModule,
    ToolbarModule,
    ToastModule,
    DialogModule,
  ]
})
export class PrimeNgModule {}
