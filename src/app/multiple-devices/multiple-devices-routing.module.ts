import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultipleDevicesPage } from './multiple-devices.page';

const routes: Routes = [
  {
    path: '',
    component: MultipleDevicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultipleDevicesPageRoutingModule {}
