import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BLE } from '@ionic-native/ble/ngx';
import { NavController, NavParams, ToastController } from '@ionic/angular';
import { Temperature } from '../../templates/Temperature';
import { TemperatureService } from '../services/temperature.service';
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
  tempUnit: boolean;
  connectedDevices: Array<{
    device: any;
    values: Array<any>;
  }> = [
    /* {
      device: { id: 'F6:EB:EA:13:2A:E2', name: 'Device1', rssi: '20' },
      values: [
        { value: 36.8, time: '12:00:00' },
        { value: 35.2, time: '12:10:00' },
        { value: 38.0, time: '12:20:00' },
        { value: 36, time: '12:30:00' },
        { value: 39, time: '13:00:00' },
      ],
    },
    {
      device: { id: 'A2:EB:EA:13:2A:E2', name: 'Device2', rssi: '20' },
      values: [
        { value: 36.8, time: '12:00:00' },
        { value: 35.2, time: '12:10:00' },
        { value: 38.0, time: '12:20:00' },
        { value: 36, time: '12:30:00' },
        { value: 35, time: '12:40:00' },
        { value: 37.6, time: '12:50:00' },
        { value: 39, time: '13:00:00' },
      ],
    }, */
  ];
  subscription: Subscription;
  now: Date;
  displayMultiple = true;
  deviceToBeDisplayed: any;
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
        this.connectedDevices = connectedDevices;
        console.log(this.connectedDevices);
      }
    );
    this.subscription = this.slidesService.currentUnit.subscribe(
      (chosenUnit) => {
        this.tempUnit = chosenUnit;
      }
    );
    console.log('Choosen unit:', this.tempUnit);

    this.connected = this.isConnected();
    if (this.connectedDevices.length === 1) {
      this.displayMultiple = false;

      this.deviceToBeDisplayed = this.connectedDevices[0];
    }
    console.log(this.displayMultiple);
  }
  getNowUTC() {
    const now = new Date();
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  }
  stopNotification() {
    this.connectedDevices.forEach((el) => {
      this.ble.stopNotification(
        el.device.id,
        '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
        '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
      );
    });
  }
  read() {
    this.connectedDevices.forEach((connectedDevice) => {
      console.log(connectedDevice);
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
            // mozda dodaj manje od neke velicine
            let tempValue;
            if (this.tempUnit) {
              tempValue = this.convertToFahrenheit(Number(this.readValue));
            } else {
              tempValue = Number(this.readValue);
            }
            const tempReading = {
              key: new Date().getTime(),
              value: tempValue,
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
    });
    /* for (let connectedDevice of this.connectedDevices) {
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
            // mozda dodaj manje od neke velicine
            let tempValue;
            if (this.tempUnit) {
              tempValue = this.convertToFahrenheit(Number(this.readValue));
            } else {
              tempValue = Number(this.readValue);
            }
            const tempReading = {
              key: new Date().getTime(),
              value: tempValue,
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
 */
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

  onEntityChange(value: any) {
    console.log(value);
    if (value === 'all') {
      this.ngZone.run(() => {
        this.displayMultiple = true;
      });
    } else {
      this.displayMultiple = false;
      this.deviceToBeDisplayed = this.connectedDevices.find(
        (el) => el.device.name === value.detail.value
      );
      console.log(this.deviceToBeDisplayed);
    }
  }
  convertToFahrenheit(celsius: number) {
    return celsius * 1.8 + 32;
  }
}
