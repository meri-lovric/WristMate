import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultipleDevicesPageRoutingModule } from './multiple-devices-routing.module';

import { MultipleDevicesPage } from './multiple-devices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultipleDevicesPageRoutingModule
  ],
  declarations: [MultipleDevicesPage]
})
export class MultipleDevicesPageModule {}
