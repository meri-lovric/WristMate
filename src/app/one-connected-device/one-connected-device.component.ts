import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-one-connected-device',
  templateUrl: './one-connected-device.component.html',
  styleUrls: ['./one-connected-device.component.scss'],
})
export class OneConnectedDeviceComponent implements OnInit {
  @Input() connectedDevice: any;
  constructor() {}

  ngOnInit() {}
}
