import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-connected-device',
  templateUrl: './connected-device.component.html',
  styleUrls: ['./connected-device.component.scss'],
})
export class ConnectedDeviceComponent implements OnInit {
  devices: Array<Object>;
  constructor(
    public modalController: ModalController,
    private ble: BLE,
  ) {}

  ngOnInit() {}
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
