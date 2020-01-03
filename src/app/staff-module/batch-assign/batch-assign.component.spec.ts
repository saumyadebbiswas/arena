import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BatchAssignComponent } from './batch-assign.component';

describe('BatchAssignComponent', () => {
  let component: BatchAssignComponent;
  let fixture: ComponentFixture<BatchAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchAssignComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BatchAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
