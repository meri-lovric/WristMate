import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(public modalController: ModalController,
    private ble: BLE,
  ) { }
  bracelet_name: string;


  ngOnInit() { }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  change_name(bracelet_name) {
    console.log(bracelet_name);
    this.ble.write('D6:63:90:E4:A9:B2', '0001800-0000-1000-8000-00805f9b34fb', ' 0002a00-0000-1000-8000-00805f9b34fb', bracelet_name);
    console.log(this.ble.read('D6:63:90:E4:A9:B2', '0001800-0000-1000-8000-00805f9b34fb', ' 0002a00-0000-1000-8000-00805f9b34fb'));

  }
}
