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
  constructor() { }
  getAllSlides(){
    return [...this.slides];
  }
}
