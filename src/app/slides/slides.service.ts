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
  categories = {
    blue: 35.0,
    green: 37.5,
    orange: 38.3,
    red: 40.0,
  };
  private messageSource = new BehaviorSubject([]);
  private unitSource = new BehaviorSubject(false);
  private alertTypeSource = new BehaviorSubject('sound');
  private categorySource = new BehaviorSubject({
    blue: 35.0,
    green: 37.5,
    orange: 38.3,
    red: 40.0,
  });
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentMessage = this.messageSource.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentUnit = this.unitSource.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentAlertType = this.alertTypeSource.asObservable();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentCategorySource = this.categorySource.asObservable();
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
    console.log('Slides service', this.connectedDevicesArray);
    this.messageSource.next(this.connectedDevicesArray);
  }
  remove(deviceToDisconnect: any) {
    const index = this.connectedDevicesArray.findIndex(
      (el) => el.device.id === deviceToDisconnect
    );

    if (index !== -1) {
      this.connectedDevicesArray.splice(index, 1);
    }
    this.messageSource.next(this.connectedDevicesArray);
  }
  changeAlertType(type: string) {
    this.alertType = type;
    this.alertTypeSource.next(this.alertType);
  }
  setInterval(limit: number, category: string) {
    switch (category) {
      case 'blue': {
        this.categories.blue = limit;
        this.categorySource.next(this.categories);
        break;
      }
      case 'green': {
        this.categories.green = limit;
        this.categorySource.next(this.categories);
        break;
      }
      case 'orange': {
        this.categories.orange = limit;
        this.categorySource.next(this.categories);
        break;
      }
      case 'red': {
        this.categories.red = limit;
        this.categorySource.next(this.categories);
        break;
      }
    }
  }
}
