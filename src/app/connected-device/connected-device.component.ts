import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { SlidesService } from '../slides/slides.service';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-connected-device',
  templateUrl: './connected-device.component.html',
  styleUrls: ['./connected-device.component.scss'],
})
export class ConnectedDeviceComponent implements OnInit {
  connectedDevices: Array<any> = [];
  subscription: Subscription;
  deviceToDisconnect: string;
  constructor(
    public modalController: ModalController,
    private ble: BLE,
    private slidesService: SlidesService,
    public alertController: AlertController,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
      this.subscription = this.slidesService.currentMessage.subscribe(
      (connectedDevices) => {
        console.log('Connected devices', connectedDevices);
        // eslint-disable-next-line prefer-const
        this.connectedDevices = connectedDevices;
      }
    );
  }
  setDeviceToDisconnect(deviceMAC: string) {
    this.deviceToDisconnect = deviceMAC;
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Disconnect?',
      backdropDismiss: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            return false;
          },
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
            this.disconnect(this.deviceToDisconnect);
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  disconnect(deviceMAC: string) {
    this.ble.disconnect(deviceMAC).then(() => {
      console.log('Disconnected ', deviceMAC);
      this.slidesService.remove(deviceMAC);
    });

    this.ngZone.run(() => {
      const index = this.connectedDevices.findIndex(
        (el) => el.device.id === deviceMAC
      );
      if (index !== -1) {
        this.connectedDevices.splice(index, 1);
      }
      console.log(this.connectedDevices);
    });
  }
}
