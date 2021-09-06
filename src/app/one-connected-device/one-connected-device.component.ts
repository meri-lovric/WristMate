import { Component, OnInit, Input } from '@angular/core';
import { alertController } from '@ionic/core';
import { Subscription } from 'rxjs';
import { SlidesService } from '../slides/slides.service';
/* import { Vibration } from '@ionic-native/vibration/ngx';
  import { NativeAudio } from '@ionic-native/native-audio/';
 */
@Component({
  selector: 'app-one-connected-device',
  templateUrl: './one-connected-device.component.html',
  styleUrls: ['./one-connected-device.component.scss'],
})
export class OneConnectedDeviceComponent implements OnInit {
  @Input() connectedDevice: any;
  subscription: Subscription;
  tempUnit: boolean;
  alertType: string;
  constructor(
    private slidesService: SlidesService,
   /*  private nativeAudio: NativeAudio,
     private vibration: Vibration*/
  ) {}
  ngOnInit() {
    this.subscription = this.slidesService.currentUnit.subscribe(
      (chosenUnit) => {
        this.tempUnit = chosenUnit;
      }
    );
    this.subscription = this.slidesService.currentAlertType.subscribe(
      (alertType) => {
        this.alertType = alertType;
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
       */    break;
      }
      case 'vibration':{
        console.log(this.alertType);
   /*      this.vibration.vibrate([2000,1000,2000]);
    */     break;
      }
    }
  }
}
