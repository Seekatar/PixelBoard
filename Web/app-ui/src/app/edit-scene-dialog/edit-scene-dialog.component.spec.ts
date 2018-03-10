import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSceneDialogComponent } from './edit-scene-dialog.component';

describe('EditSceneDialogComponent', () => {
  let component: EditSceneDialogComponent;
  let fixture: ComponentFixture<EditSceneDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSceneDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSceneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
