import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAccountPanelComponent } from './settings-account-panel.component';

describe('SettingsAccountPanelComponent', () => {
  let component: SettingsAccountPanelComponent;
  let fixture: ComponentFixture<SettingsAccountPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsAccountPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsAccountPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
