import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { SlidesService } from '../slides/slides.service';

@Component({
  selector: 'app-multiple-connected-devices',
  templateUrl: './multiple-connected-devices.component.html',
  styleUrls: ['./multiple-connected-devices.component.scss'],
})
export class MultipleConnectedDevicesComponent implements OnInit {
  @Input() connectedDevices: any;
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
