import { Component, OnInit } from '@angular/core';
import { Slide } from './slide.model';
import { SlidesService } from './slides.service';
@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  slides: Slide[];
  constructor(private slidesService: SlidesService) {}

  ngOnInit() {
    this.slides = this.slidesService.getAllSlides();
  }
}
