import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultipleConnectedDevicesComponent } from './multiple-connected-devices.component';

describe('MultipleConnectedDevicesComponent', () => {
  let component: MultipleConnectedDevicesComponent;
  let fixture: ComponentFixture<MultipleConnectedDevicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleConnectedDevicesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleConnectedDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
