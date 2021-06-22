import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BLE } from '@ionic-native/ble/ngx';
import { NavController, NavParams } from '@ionic/angular';
import { Temperature } from '../../templates/Temperature';
import { TemperatureService } from './temperature.service';
import { v4 as uuidv4 } from 'uuid';

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
  /* tempReading: Temperature = {
    $key: null,
    value: '',
    time: null,
  }; */
  now: Date;
  constructor(
    private ble: BLE,
    private ngZone: NgZone,
    private tempService: TemperatureService
  ) {
    setInterval(() => {
      this.now = new Date();
    }, 1);
  }

  ngOnInit(): void {
    this.statusMessage = 'disconnected';
  }
  getNowUTC() {
    const now = new Date();
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  }
  scan() {
    this.ble.scan([], 4).subscribe((device) => {
      console.log(device);
      if (device && device.name) {
        this.peripherals = [...this.peripherals, device.name];
        this.statusMessage = this.peripherals.reduce((a, b) => a + ', ' + b);
        console.log(this.statusMessage);
      }
    });
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
  read() {
    this.ble
      .startNotification(
        'D6:63:90:E4:A9:B2',
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
        const tempReading = {
          key: new Date().getTime(),
          value: this.readValue.slice(2, 7),
          time: this.now.toUTCString(),
        };
        //this.currentValue = Number(this.readValue);
        /*   this.tempReading.key = new Date().getTime();
        this.tempReading.value = this.readValue;
        this.tempReading.time = this.now.toUTCString();
        console.log('KEY: ', this.tempReading.key); */
        console.log('READ TEMP: ', tempReading);
        this.tempService
          .createTemperature('D6:63:90:E4:A9:B2', tempReading)
          .then((result) => {
            console.log(result);
          })
          .catch((error) => console.log(error));
        console.log('STR2: ' + this.readValue.slice(2, 7));
        this.ngZone.run(() => {
          this.values.push(Number(this.readValue.slice(2, 7)));
          console.log(this.readValue.slice(2, 7));
        });
      });
  }
}
