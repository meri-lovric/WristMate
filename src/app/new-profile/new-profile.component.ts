import { Component, OnInit } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import {
  AlertController,
  ModalController,
  PickerController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Profile } from '../../templates/Profile';
import { ProfileService } from '../services/profile.service';
import { SlidesService } from '../slides/slides.service';
import { PickerOptions } from '@ionic/core';

@Component({
  selector: 'app-new-profile',
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.scss'],
})
export class NewProfileComponent implements OnInit {
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
  inputName: string;
  selectedDevice: any;
  existsInDB: boolean;
  displaySettings = false;
  public tempUnit = false;
  public alertType: string;
  userName: string;
  age: number;
  room: string;
  state: string;
  height: number;
  weight: number;
  constructor(
    public modalController: ModalController,
    private ble: BLE,
    private slidesService: SlidesService,
    public alertController: AlertController,
    private profileService: ProfileService,
    private pickerController: PickerController
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
    console.log(this.tempUnit);
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
  toggleUnit() {
    this.slidesService.toggleUnit(this.tempUnit);
  }
  disconnect(device: string) {
    if (this.presentAlertMultipleButtons()) {
      this.ble.disconnect(device).then(() => {
        console.log('Disconnected ', device);
      });
    }
  }
  onChooseDevice(value: any) {
    this.selectedDevice = this.connectedDevices.find(
      (el) => el.device.name === value.detail.value
    );
    console.log(this.selectedDevice);
    console.log(value.detail.value);
    console.log(this.selectedDevice.device.id);
    const profile = this.profileService.getProfile(
      this.selectedDevice.device.id
    );
    console.log(profile);
    this.displaySettings = true;
  }
  changeName() {
    console.log(this.inputName);
    this.ble.write(
      'D6:63:90:E4:A9:B2',
      '0001800-0000-1000-8000-00805f9b34fb',
      ' 0002a00-0000-1000-8000-00805f9b34fb',
      Object(this.inputName)
    );
    console.log(
      this.ble.read(
        'D6:63:90:E4:A9:B2',
        '0001800-0000-1000-8000-00805f9b34fb',
        ' 0002a00-0000-1000-8000-00805f9b34fb'
      )
    );
  }
  send() {
    let profile = new Profile();
    profile = {
      key: new Date().getTime(),
      name: 'Meri',
      age: 25,
      room: null,
      state: 'okay',
      height: 173,
      weight: 80,
      braceletName: this.selectedDevice.device.name,
    };
    this.profileService.createProfile('F6:EB:EA:13:2A:E2', profile);
  }
  changeUserName() {}
  changeRoom() {}
  changeAlertType(type: string) {
    this.slidesService.changeAlertType(type);
  }
  async showAgePicker() {
    const options: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: (value: any) => {
            this.age = value;
          },
        },
      ],
      columns: [
        {
          name: 'Age',
          options: this.getColumnOptions(),
        },
      ],
    };
    const picker = await this.pickerController.create(options);
    picker.present();
  }
  getColumnOptions() {
    const options = [];
    for (let i = 7; i < 100; i++) {
      options.push({ text: i, value: i });
    }
    console.log(options);
    return options;
  }
  async openModal() {
    const modal = await this.modalController.create({
      component: NewProfileComponent,
    });
    return await modal.present();
  }
  createNewProfile() {
    let profile = new Profile();
    profile = {
      key: new Date().getTime(),
      name: this.userName,
      age: this.age,
      room: this.room ? this.room : null,
      state: 'okay',
      height: this.height,
      weight: this.weight,
      braceletName: this.selectedDevice.device.name,
    };
    try {
      this.profileService.createProfile(this.selectedDevice.device.id, profile);
    } catch {
      console.log('Error creating user');
    } finally {
      this.userName = '';
      this.age = null;
      this.room = '';
      this.height = null;
      this.weight = null;
    }
  }
}
