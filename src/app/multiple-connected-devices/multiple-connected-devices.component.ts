import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { SlidesService } from '../slides/slides.service';
/* import { NativeAudio } from '@ionic-native/native-audio/';
 import { Vibration } from '@ionic-native/vibration/ngx';
*/
@Component({
  selector: 'app-multiple-connected-devices',
  templateUrl: './multiple-connected-devices.component.html',
  styleUrls: ['./multiple-connected-devices.component.scss'],
})
export class MultipleConnectedDevicesComponent implements OnInit {
  @Input() connectedDevices: any;
  subscription: Subscription;
  tempUnit: boolean;
  alertType: string;

  constructor(
    private slidesService: SlidesService
  ) /*    private nativeAudio: NativeAudio,
     private vibration: Vibration*/
  {}
  ngOnInit() {
    this.subscription = this.slidesService.currentUnit.subscribe(
      (chosenUnit) => {
        this.tempUnit = chosenUnit;
      }
    );
  }
  fireAlert() {
    switch (this.alertType) {
      case 'sound': {
        console.log(this.alertType);
        /*   this.nativeAudio
          .preloadSimple(
            'uniqueId1',
            '../../../resources/audio/point-blank-589.mp3'
          )
          .then(() => {
            console.log('Played audio');
          });
       */ break;
      }
      case 'vibration': {
        console.log(this.alertType);

        /*   this.vibration.vibrate([2000, 1000, 2000]);
         */ break;
      }
    }
  }
}
