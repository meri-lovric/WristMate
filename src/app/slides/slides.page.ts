import { Component, OnDestroy, OnInit } from '@angular/core';
import { Slide } from './slide.model';
import { SlidesService } from './slides.service';
import { SettingsComponent } from '../settings/settings.component';
import { ConnectedDeviceComponent } from '../connected-device/connected-device.component';
import { ModalController, ToastController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit, OnDestroy {
  messages: Array<Object>;
  subscription: Subscription;
  slideOpts = {
    /* initialSlide: 0,
    speed: 400, */
    initialSlide: 0,
    speed: 400,
    spaceBetween: 0,
    slidesPreview: 2,
    slidesOffsetBefore: 6,
    slidesPerView: 'auto',
    zoom: true,
    grabCursor: true,
    direction: 'horizontal',
  };
  slides: Slide[];
  public isBluetoothEnabled: boolean;
  public isLocationEnabled: boolean;
  constructor(
    private slidesService: SlidesService,
    public modalController: ModalController,
    public toastController: ToastController,
    private ble: BLE,
  ) { }

  ngOnInit() {
    this.slides = this.slidesService.getAllSlides();
    this.subscription = this.slidesService.currentMessage.subscribe(message => this.messages = message)
    this.ble.isEnabled().then(
      () => {
        console.log('Bluetooth enabled');
        this.isBluetoothEnabled = true;
        this.presentBluetoothToast(this.isBluetoothEnabled);
      },
      () => {
        console.log('Bluetooth disabled');
        this.isBluetoothEnabled = false;
        this.presentBluetoothToast(this.isBluetoothEnabled);
        this.ble.enable().then(
          () => {
            this.isBluetoothEnabled = true;
            this.presentBluetoothToast(this.isBluetoothEnabled);
          },
          () => {
            this.presentBluetoothToast(this.isBluetoothEnabled);
          }
        );
      }
    );
    this.ble.isLocationEnabled().then(
      () => {
        console.log('Location enabled');
        this.isLocationEnabled = true;
        this.presentLocationToast(this.isLocationEnabled);
      },
      () => {
        console.log('Location disabled');
        this.isLocationEnabled = false;
        this.presentLocationToast(this.isLocationEnabled);
      }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  async presentModalSettings() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }
  async presentModalDevices() {
    const modal = await this.modalController.create({
      component: ConnectedDeviceComponent,
      componentProps: {
        devices: this.messages
      },
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  async presentBluetoothToast(bluetoothState: boolean) {
    const toast = await this.toastController.create({
      message: bluetoothState ? 'Bluetooth enabled' : 'Bluetooth disabled',
      duration: 2000,
    });
    toast.present();
  }
  async presentLocationToast(locationState: boolean) {
    const toast = await this.toastController.create({
      message: locationState ? 'Location enabled' : 'Location disabled',
      duration: 2000,
    });
    toast.present();
  }

}
