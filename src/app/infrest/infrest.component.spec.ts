import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfrestComponent } from './infrest.component';

describe('InfrestComponent', () => {
  let component: InfrestComponent;
  let fixture: ComponentFixture<InfrestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfrestComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfrestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
