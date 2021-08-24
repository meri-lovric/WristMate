import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-multiple-connected-devices',
  templateUrl: './multiple-connected-devices.component.html',
  styleUrls: ['./multiple-connected-devices.component.scss'],
})
export class MultipleConnectedDevicesComponent implements OnInit {
  @Input() connectedDevices: any;
  constructor() {}

  ngOnInit() {
    console.log(this.connectedDevices);
  }
}
