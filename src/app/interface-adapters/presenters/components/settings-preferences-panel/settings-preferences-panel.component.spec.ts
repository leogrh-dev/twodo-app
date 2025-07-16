import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPreferencesPanelComponent } from './settings-preferences-panel.component';

describe('SettingsPreferencesPanelComponent', () => {
  let component: SettingsPreferencesPanelComponent;
  let fixture: ComponentFixture<SettingsPreferencesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPreferencesPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsPreferencesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
