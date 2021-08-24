import { Component, OnInit } from '@angular/core';
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
  connectedDevices: Array<any> = [
    {
      device: { id: 'F6:EB:EA:13:2A:E2', name: 'Device1', rssi: '20' },
      values: [36.8, 35.2, 38.0, 36, 35, 37.6, 39],
    },
    {
      device: { id: 'D6:63:90:E4:A9:B2', name: 'Device2', rssi: '90' },
      values: [39.8, 32.2, 33.0, 34, 38, 39.6, 37],
    },
    {
      device: { id: 'D6:63:90:E4:A9:B2', name: 'Device2', rssi: '90' },
      values: [39.8, 32.2, 33.0, 34, 38, 39.6, 37],
    },
    {
      device: { id: 'D6:63:90:E4:A9:B2', name: 'Device2', rssi: '90' },
      values: [39.8, 32.2, 33.0, 34, 38, 39.6, 37],
    },
    {
      device: { id: 'D6:63:90:E4:A9:B2', name: 'Device2', rssi: '90' },
      values: [39.8, 32.2, 33.0, 34, 38, 39.6, 37],
    },
    {
      device: { id: 'D6:63:90:E4:A9:B2', name: 'Device2', rssi: '90' },
      values: [39.8, 32.2, 33.0, 34, 38, 39.6, 37],
    },
  ];
  subscription: Subscription;

  constructor(
    public modalController: ModalController,
    private ble: BLE,
    private slidesService: SlidesService,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.subscription = this.slidesService.currentMessage.subscribe(
      (connectedDevices) => {
        // eslint-disable-next-line prefer-const
        for (let device of connectedDevices) {
          this.connectedDevices.push({ device, values: [] });
        }
      }
    );
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
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'Disconnect?',
      backdropDismiss: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            return true;
          },
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
            return false;
          },
        },
      ],
    });

    await alert.present();
  }

  disconnect(device: string) {
    if (this.presentAlertMultipleButtons()) {
      this.ble.disconnect(device).then(() => {
        console.log('Disconnected ', device);
      });
    }
  }
}
