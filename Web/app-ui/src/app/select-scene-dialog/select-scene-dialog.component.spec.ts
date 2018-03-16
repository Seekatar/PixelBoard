import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSceneDialogComponent } from './select-scene-dialog.component';

describe('SelectSceneDialogComponent', () => {
  let component: SelectSceneDialogComponent;
  let fixture: ComponentFixture<SelectSceneDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSceneDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSceneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
