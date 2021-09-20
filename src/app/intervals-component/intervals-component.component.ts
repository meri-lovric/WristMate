import { Component, OnInit } from '@angular/core';
import { SlidesService } from '../slides/slides.service';

@Component({
  selector: 'app-intervals-component',
  templateUrl: './intervals-component.component.html',
  styleUrls: ['./intervals-component.component.scss'],
})
export class IntervalsComponent implements OnInit {
  blue = 35.0;
  green = 37.5;
  orange = 38.3;
  red = 40.0;
  newBlue;
  newGreen;
  newOrange;
  newRed;
  constructor(private slidesService: SlidesService) {}
  setInterval(interval: string) {
    switch (interval) {
      case 'blue': {
        this.blue = this.newBlue;
        this.slidesService.setInterval(this.blue, 'blue');
        break;
      }
      case 'green': {
        this.newGreen = this.newGreen;
        this.slidesService.setInterval(this.green, 'green');
        break;
      }
      case 'orange': {
        this.orange = this.newOrange;
        this.slidesService.setInterval(this.orange, 'orange');
        break;
      }
      case 'red': {
        this.red = this.newRed;
        this.slidesService.setInterval(this.red, 'red');
        break;
      }
    }
  }
  ngOnInit() {}
}
