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
  peripherals: any[] = [];
  statusMessage: string;
  subscription: Subscription;
  connectedDevice: string;
  connectedDevices: Array<any>;
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
        this.connectedDevice = device;
        this.presentModal(peripheralData);
        this.slidesService.changeMessage(peripheralData);
      },
      (peripheralData) => {
        console.log('disconnected');
      }
    );
  }
  read() {
    // buffer = new ArrayBuffer(16);
    //const view1 = new DataView(buffer);
    //TEMPERATURE
    this.ble
      .startNotification(
        'D6:63:90:E4:A9:B2',
        '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
        '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
      )
      .subscribe((buffer) => {
        this.responses.push(buffer[0]);
        console.log(
          'TEMP:' + String.fromCharCode.apply(null, new Uint8Array(buffer[0]))
        );
        this.readValue = String.fromCharCode
          .apply(null, new Uint8Array(buffer[0]))
          .slice(14);
        console.log('STR2: ' + this.readValue.slice(0, 5));
        this.values.push(this.readValue.slice(0, 5));
      });
  }
  disconnect() {
    this.ble.disconnect('D6:63:90:E4:A9:B2').then(() => {
      console.log('Disconnected');
    });
  }
  async presentModal(connectedDevice: any) {
    console.log(this.connectedDevice);
    const modal = await this.modalController.create({
      component: ConnectedDeviceComponent,
      componentProps: {
        device: connectedDevice,
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
  }
}
