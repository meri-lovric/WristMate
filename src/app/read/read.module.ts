import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadPageRoutingModule } from './read-routing.module';

import { ReadPage } from './read.page';
import { OneConnectedDeviceComponent } from '../one-connected-device/one-connected-device.component';
import { MultipleConnectedDevicesComponent } from '../multiple-connected-devices/multiple-connected-devices.component';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReadPageRoutingModule],
  declarations: [
    ReadPage,
    OneConnectedDeviceComponent,
    MultipleConnectedDevicesComponent,
  ],
  exports: [OneConnectedDeviceComponent, MultipleConnectedDevicesComponent],
})
export class ReadPageModule {}
