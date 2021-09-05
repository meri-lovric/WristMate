import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { SlidesService } from '../slides/slides.service';

@Component({
  selector: 'app-one-connected-device',
  templateUrl: './one-connected-device.component.html',
  styleUrls: ['./one-connected-device.component.scss'],
})
export class OneConnectedDeviceComponent implements OnInit {
  @Input() connectedDevice: any;
  subscription: Subscription;
  tempUnit: boolean;

  constructor(    private slidesService: SlidesService
    ) {}
  ngOnInit() {    this.subscription = this.slidesService.currentUnit.subscribe(
    (chosenUnit) => {
      this.tempUnit = chosenUnit;
    }
  );
}
}
