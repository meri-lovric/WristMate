import { Injectable } from '@angular/core';
import { Slide } from './slide.model';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SlidesService {
  connectedDevicesArray: Array<Object> = []
  private messageSource = new BehaviorSubject([]);
  currentMessage = this.messageSource.asObservable();

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
  changeMessage(message: Object){
    this.connectedDevicesArray.push(message)
    this.messageSource.next(this.connectedDevicesArray);
  }
}
