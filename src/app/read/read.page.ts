import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BLE } from '@ionic-native/ble/ngx';
import { NavController, NavParams, ToastController } from '@ionic/angular';
import { Temperature } from '../../templates/Temperature';
import { TemperatureService } from './temperature.service';
import { v4 as uuidv4 } from 'uuid';
import { SlidesService } from '../slides/slides.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-read',
  templateUrl: './read.page.html',
  styleUrls: ['./read.page.scss'],
})
export class ReadPage implements OnInit {
  peripherals: string[] = [];
  statusMessage: string;
  readValue = '';
  currentValue: number;
  values: number[] = [];
  connected = false;
  connectedDevices: Array<{
    device: any;
    values: Array<any>;
  }> = [
    {
      device: { id: 'F6:EB:EA:13:2A:E2', name: 'Device1', rssi: '20' },
      values: [
        { value: 36.8, time: '12:00:00' },
        { value: 35.2, time: '12:10:00' },
        { value: 38.0, time: '12:20:00' },
        { value: 36, time: '12:30:00' },
        { value: 35, time: '12:40:00' },
        { value: 37.6, time: '12:50:00' },
        { value: 39, time: '13:00:00' },
      ],
    },
    {
      device: { id: 'F6:EB:EA:13:2A:E2', name: 'Device1', rssi: '20' },
      values: [
        { value: 36.8, time: '12:00:00' },
        { value: 35.2, time: '12:10:00' },
        { value: 38.0, time: '12:20:00' },
        { value: 36, time: '12:30:00' },
        { value: 35, time: '12:40:00' },
        { value: 37.6, time: '12:50:00' },
        { value: 39, time: '13:00:00' },
      ],
    },
    {
      device: { id: 'F6:EB:EA:13:2A:E2', name: 'Device1', rssi: '20' },
      values: [
        { value: 36.8, time: '12:00:00' },
        { value: 35.2, time: '12:10:00' },
        { value: 38.0, time: '12:20:00' },
        { value: 36, time: '12:30:00' },
        { value: 35, time: '12:40:00' },
        { value: 37.6, time: '12:50:00' },
        { value: 39, time: '13:00:00' },
      ],
    },
  ];
  subscription: Subscription;
  now: Date;
  constructor(
    private ble: BLE,
    private ngZone: NgZone,
    private tempService: TemperatureService,
    public toastController: ToastController,
    private slidesService: SlidesService
  ) {
    setInterval(() => {
      this.now = new Date();
    }, 1);
  }

  ngOnInit(): void {
    this.statusMessage = 'disconnected';
    this.subscription = this.slidesService.currentMessage.subscribe(
      (connectedDevices) => {
        // eslint-disable-next-line prefer-const
        for (let device of connectedDevices) {
          this.connectedDevices.push({ device, values: [] });
        }
      }
    );
    this.connected = this.isConnected();
  }
  getNowUTC() {
    const now = new Date();
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  }
  connect(device: string) {
    this.ble.connect(device).subscribe(
      (peripheralData) => {
        console.log(peripheralData);
        this.statusMessage = 'connected';
      },
      (peripheralData) => {
        console.log('disconnected');
      }
    );
  }
  singleRead() {
    for (const connectedDevice of this.connectedDevices) {
      this.ble
        .read(
          connectedDevice.device.id,
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
          '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
        )
        .then((result) => console.log('Read result - ', result))
        .catch((err) => console.log(err));
      this.ble
        .read(connectedDevice.device.id, 'fee7', 'fec9')
        .then((result) => console.log('Read result2 - ', result))
        .catch((err) => console.log(err));
      this.ble
        .read(
          connectedDevice.device.id,
          '0000fee7-0000-1000-8000-00805f9b34fb',
          '0000fea1-0000-1000-8000-00805f9b34fb'
        )
        .then((result) => {
          console.log('Read result3 - ', result);
          const convertData = String.fromCharCode.apply(null, result);
          const hexResult = [];
          for (let i = 0; i < convertData.length; i++) {
            const resultNumber = convertData.charCodeAt(i); //Dec
            const str = (+resultNumber).toString(16);
            let resultString = '';
            if (str.length <= 1) {
              resultString = ('0' + (+resultNumber).toString(16))
                .toUpperCase()
                .substring(-2); //String
            } else {
              resultString = ('' + (+resultNumber).toString(16))
                .toUpperCase()
                .substring(-2); //String
            }
            hexResult[i] = '0x' + resultString;
          }
          console.log('hex data:::' + hexResult);
        })
        .catch((err) => console.log(err));
    }
  }
  read() {
    for (const connectedDevice of this.connectedDevices) {
      this.ble
        .startNotification(
          connectedDevice.device.id,
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
          '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
        )
        .subscribe((buffer) => {
          console.log(
            'TEMP:' + String.fromCharCode.apply(null, new Uint8Array(buffer[0]))
          );
          this.readValue = String.fromCharCode
            .apply(null, new Uint8Array(buffer[0]))
            .substr(24, 5);
          console.log(
            'READ VALUE STRING:',
            this.readValue,
            '\n IS NUMBER:',
            !isNaN(Number(this.readValue))
          );
          if (!isNaN(Number(this.readValue)) && this.readValue.length > 1) {
            const tempReading = {
              key: new Date().getTime(),
              value: Number(this.readValue),
              time: this.now.toUTCString(),
            };
            console.log(
              'Device:',
              connectedDevice.device.id,
              '\nRead temperature: ',
              tempReading
            );
            this.tempService
              .createTemperature(connectedDevice.device.id, tempReading)
              .then((result) => {
                console.log(result);
              })
              .catch((error) => console.log(error));
            this.ngZone.run(() => {
              connectedDevice.values.push({
                value: tempReading.value,
                time: tempReading.time,
              });
              console.log(this.readValue);
            });
          }
        });
    }
  }
  isConnected() {
    this.connectedDevices.forEach((connectedDevice) => {
      this.ble.isConnected(connectedDevice.device.id).then(
        () => {
          console.log(connectedDevice.device.id, ' is connected');
          return true;
        },
        () => {
          console.log(connectedDevice.device.id, ' is not connected');
        }
      );
    });
    return false;
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000,
    });
    toast.present();
  }
  newFunction() {
    console.log('NEW FUNCTION');
    this.ble
      .startNotification(
        'D6:63:90:E4:A9:B2',
        'be940000-7333-be46-b7ae-689e71722bd5',
        'be940001-7333-be46-b7ae-689e71722bd5'
      )
      .subscribe((buffer) => {
        console.log(
          'NEW FUNCTION:' +
            String.fromCharCode.apply(null, new Uint8Array(buffer[0]))
        );
      });
  }
  newFunction2() {
    console.log('NEW FUNCTION2');
    this.ble
      .startNotification(
        'D6:63:90:E4:A9:B2',
        'be940000-7333-be46-b7ae-689e71722bd5',
        'be940003-7333-be46-b7ae-689e71722bd5'
      )
      .subscribe((buffer) => {
        console.log(
          'NEW FUNCTION2:' +
            String.fromCharCode.apply(null, new Uint8Array(buffer[0]))
        );
      });
  }
  newFunction3() {
    console.log('NEW FUNCTION3');
    this.ble
      .startNotification('D6:63:90:E4:A9:B2', 'fee7', 'fea1')
      .subscribe((buffer) => {
        console.log(
          'NEW FUNCTION3:' +
            String.fromCharCode.apply(null, new Uint8Array(buffer[0]))
        );
      });
  }
  newFunction4() {
    console.log('NEW FUNCTION4');
    this.ble
      .startNotification('D6:63:90:E4:A9:B2', 'fee7', 'fea2')
      .subscribe((buffer) => {
        console.log(
          'NEW FUNCTION4:' +
            String.fromCharCode.apply(null, new Uint8Array(buffer[0]))
        );
      });
  }
}
