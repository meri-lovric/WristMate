import { Component, OnInit } from '@angular/core';
import { BLE } from '@ionic-native/ble/';
import { NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-historx',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  peripherals: string[] = [];
  statusMessage: string;
  constructor() {}

  ngOnInit(): void {
    this.statusMessage = 'disconnected';
  }
  scan() {
    BLE.scan([], 4).subscribe((device) => {
      console.log(device);
      if (device && device.name) {
        this.peripherals = [...this.peripherals, device.name];
        this.statusMessage = this.peripherals.reduce((a, b) => a + ', ' + b);
        console.log(this.statusMessage);
      }
    });
  }
  connect(device: string) {
    BLE.connect(device).subscribe(
      (peripheralData) => {
        console.log(peripheralData);
        this.statusMessage = 'connected';
      },
      (peripheralData) => {
        console.log('disconnected');
      }
    );
  }
}
