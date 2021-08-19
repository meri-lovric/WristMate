import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ConnectedDeviceComponent } from '../connected-device/connected-device.component';
import { SlidesService } from '../slides/slides.service';
@Component({
  selector: 'app-connect',
  templateUrl: './connect.page.html',
  styleUrls: ['./connect.page.scss'],
})
export class ConnectPage implements OnInit, OnDestroy {
  peripherals: Array<any> = [
     /* {
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
    }, */
  ];
  statusMessage: string;
  subscription: Subscription;
  connectedDevices: Array<any> = [];
  characteristics: string;
  responses: any[] = [];
  readValue = '';
  values: any[] = [];
  constructor(
    private ble: BLE,
    private ngZone: NgZone,
    public modalController: ModalController,
    private slidesService: SlidesService
  ) {}
  ngOnInit() {
    this.subscription = this.slidesService.currentMessage.subscribe(
      (connectedDevices) => (this.connectedDevices = connectedDevices)
    );
    this.statusMessage = 'disconnected';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  scan() {
    this.peripherals = [];
    this.responses = [];
    this.ble
      .scan([], 10)
      .subscribe((device) => this.onDeviceDiscovered(device));
  }
  onDeviceDiscovered(device) {
    console.log('Discovered:', JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.peripherals.push(device);
      console.log(device);
    });
  }
  connect(device: string) {
    this.ble.connect(device).subscribe(
      (peripheralData) => {
        console.log(peripheralData);
        this.presentModal(peripheralData);
        this.slidesService.changeMessage(peripheralData);
      },
      (peripheralData) => {
        console.log('disconnected');
      }
    );
  }
  disconnect(device: string) {
    this.ble.disconnect(device).then(() => {
      console.log('Disconnected ', device);
    });
  }
  async presentModal(connectedDevice: any) {
    console.log(connectedDevice);
    const modal = await this.modalController.create({
      component: ConnectedDeviceComponent,
      componentProps: {
        devices: this.connectedDevices,
      },
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }
  listConnectedDevices() {
    this.ble.bondedDevices().then(
      (result) => {
        console.log('Bonded devices: ', result);
      },
      (err) => {
        console.log(err);
      }
    );
    console.log('Connected devices: ', this.peripherals);
  }
}
