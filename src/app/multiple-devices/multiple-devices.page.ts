import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-multiple-devices',
  templateUrl: './multiple-devices.page.html',
  styleUrls: ['./multiple-devices.page.scss'],
})
export class MultipleDevicesPage implements OnInit {
  @Input() connectedDevices: any;
  constructor() {}

  ngOnInit() {}
}
