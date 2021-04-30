import { Injectable } from '@angular/core';
import { Slide } from './slide.model';

@Injectable({
  providedIn: 'root'
})
export class SlidesService {
  private slides: Slide[] = [
    {
      id: 'slide1',
      title: 'Connect',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bluetooth.svg/800px-Bluetooth.svg.png',
      subtitle: ['Connect to a device'],
    },
    {
      id: 'slide2',
      title: 'Comment',
      imageUrl: 'https://www.svgrepo.com/show/163525/write.svg',
      subtitle: ['Add additional information'],
    },
    {
      id: 'slide3',
      title: 'Read',
      imageUrl: 'https://www.svgrepo.com/show/163525/write.svg',
      subtitle: ['Add additional information'],
    },
    {
      id: 'slide4',
      title: 'History',
      imageUrl: '<ion-icon name="bar-chart"></ion-icon>',
      subtitle: ['Add additional information'],
    },
  ];
  constructor() { }
  getAllSlides(){
    return [...this.slides];
  }
}
