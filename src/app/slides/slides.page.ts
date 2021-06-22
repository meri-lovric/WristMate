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
    /* initialSlide: 0,
    speed: 400, */
    initialSlide: 0,
    speed: 400,
    spaceBetween: 0,
    slidesPreview: 2,
    slidesOffsetBefore: 6,
    slidesPerView: 'auto',
    zoom: true,
    grabCursor: true,
    direction: 'horizontal',
  };
  slides: Slide[];
  constructor(private slidesService: SlidesService) {}

  ngOnInit() {
    this.slides = this.slidesService.getAllSlides();
  }
}
