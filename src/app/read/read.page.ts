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
  connectedDevices: Array<any> = []; /* = [
    {
      name: '1',
    },
    {
      name: '2',
    },
    {
      name: '3',
    },
    {
      name: '4',
    },
    {
      name: '5',
    },
    {
      name: '6',
    },
    {
      name: '7',
    },
    {
      name: '8',
    },
    {
      name: '9',
    },
  ]; */
  subscription: Subscription;

  /* tempReading: Temperature = {
    $key: null,
    value: '',
    time: null,
  }; */
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
      (connectedDevices) => (this.connectedDevices = connectedDevices)
    );
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
    this.ble
      .read(
        'D6:63:90:E4:A9:B2',
        '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
        '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
      )
      .then((result) => console.log('Read result - ', result))
      .catch((err) => console.log(err));
    this.ble
      .read('D6:63:90:E4:A9:B2', 'fee7', 'fec9')
      .then((result) => console.log('Read result2 - ', result))
      .catch((err) => console.log(err));
  }
  read() {
    for (const device of this.connectedDevices) {
      this.ble
        .startNotification(
          device.name,
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
          '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
        )
        .subscribe((buffer) => {
          console.log(
            'TEMP:' + String.fromCharCode.apply(null, new Uint8Array(buffer[0]))
          );
          this.readValue = String.fromCharCode
            .apply(null, new Uint8Array(buffer[0]))
            .slice(14);
          if (!isNaN(Number(this.readValue))) {
            const tempReading = {
              key: new Date().getTime(),
              value: Number(this.readValue),
              time: this.now.toUTCString(),
            };
            console.log(
              'Device: ", device.name,"\nRead temperature: ',
              tempReading
            );
            this.tempService
              .createTemperature(device.name, tempReading)
              .then((result) => {
                console.log(result);
              })
              .catch((error) => console.log(error));
            //console.log('STR2: ' + this.readValue.slice(2, 7));
            this.ngZone.run(() => {
              this.values.push(Number(this.readValue.slice(28, 33)));
              console.log(this.readValue.slice(28, 33));
            });
          }
        });
    }
  }
  isConnected() {
    for (const device of this.connectedDevices) {
      this.ble.isConnected(device.name).then(
        () => {
          console.log(device.name, ' is connected');
          return true;
        },
        () => {
          console.log(device.name, ' is not connected');
          return false;
        }
      );
    }
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
