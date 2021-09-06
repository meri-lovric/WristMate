import { Injectable } from '@angular/core';
import { Slide } from './slide.model';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SlidesService {
  connectedDevicesArray: Array<any> = [];
  chosenUnit = false;
  alertType: string;
  private messageSource = new BehaviorSubject([]);
  private unitSource = new BehaviorSubject(false);
  private alertTypeSource = new BehaviorSubject('sound');
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentMessage = this.messageSource.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentUnit = this.unitSource.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentAlertType = this.alertTypeSource.asObservable();
  private slides: Slide[] = [
    {
      id: 'slide1',
      title: 'Connect',
      subtitle: ['Connect to a device'],
    },
    {
      id: 'slide2',
      title: 'Read',
      subtitle: ['Start measurement'],
    },
    {
      id: 'slide3',
      title: 'Comment',
      subtitle: ['Add additional information'],
    },
    {
      id: 'slide4',
      title: 'History',
      subtitle: ['Display collected data'],
    },
    {
      id: 'slide5',
      title: 'Multiple devices',
      subtitle: ['Monitor multiple connected devices'],
    },
  ];
  constructor() {}
  getAllSlides() {
    return [...this.slides];
  }
  toggleUnit(isChecked: boolean) {
    this.chosenUnit = isChecked;
    this.unitSource.next(this.chosenUnit);
    console.log(this.chosenUnit);
  }
  changeMessage(connectedDevice: any) {
    this.connectedDevicesArray.push(connectedDevice);
    this.messageSource.next(this.connectedDevicesArray);
  }
  changeAlertType(type: string) {
    this.alertType = type;
    this.alertTypeSource.next(this.alertType);
  }
}
