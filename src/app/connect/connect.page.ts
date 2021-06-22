import { Component, OnInit, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.page.html',
  styleUrls: ['./connect.page.scss'],
})
export class ConnectPage implements OnInit {
  peripherals: any[] = [];
  statusMessage: string;
  connectedDevice: string;
  characteristics: string;
  responses: any[] = [];
  readValue = '';
  values: any[] = [];
  constructor(private ble: BLE, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.statusMessage = 'disconnected';
  }
  scan() {
    this.peripherals = [];
    this.responses = [];
    this.ble
      .scan([], 10)
      .subscribe((device) => this.onDeviceDiscovered(device));
  }
  onDeviceDiscovered(device) {
    console.log('Discovered:', JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.peripherals.push(device);
      console.log(device);
    });
  }
  connect(device: string) {
    this.ble.connect(device).subscribe(
      (peripheralData) => {
        console.log(peripheralData);
        this.connectedDevice = device;
      },
      (peripheralData) => {
        console.log('disconnected');
      }
    );
  }
  read() {
    // buffer = new ArrayBuffer(16);
    //const view1 = new DataView(buffer);
    //TEMPERATURE
    this.ble
      .startNotification(
        'D6:63:90:E4:A9:B2',
        '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
        '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
      )
      .subscribe((buffer) => {
        this.responses.push(buffer[0]);
        console.log(
          'TEMP:' + String.fromCharCode.apply(null, new Uint8Array(buffer[0]))
        );
        this.readValue = String.fromCharCode
          .apply(null, new Uint8Array(buffer[0]))
          .slice(14);
        console.log('STR2: ' + this.readValue.slice(0, 5));
        this.values.push(this.readValue.slice(0, 5));
      }); /* this.ble.read('D6:63:90:E4:A9:B2', '180D', '2A37').then((data) => {
      const strData = String.fromCharCode.apply(null, new Uint8Array(data));
      const bl = strData;
      alert('other thing9:' + bl);
      console.log('other thing9:' + bl);
    }); */
    // SUPPOSED TO BE HRV, BUT SEEMS TO BE TEMP ALSO
    /*  this.ble
      .startNotification(
        'D6:63:90:E4:A9:B2',
        '0000180d-0000-1000-8000-00805f9b34fb',
        '00002a37-0000-1000-8000-00805f9b34fb'
      )
      .subscribe((buffer) => {
        this.responses.push(buffer[0]);
        console.log(
          'HRV: ' + String.fromCharCode.apply(null, new Uint8Array(buffer[0]))
        );
      });
    */
    /*  this.ble
      .read('D6:63:90:E4:A9:B2', '1800', '2a00')
      .then((data) => {
        view1.setInt32(0, data);
        console.log('s:1800,c:2a00 - ' + view1.getInt32(0).toString(16));
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read('D6:63:90:E4:A9:B2', '1800', '2a01')
      .then((data) => {
        view1.setInt32(0, data);

        console.log('s:1800,c:2a01 - ' + view1.getInt32(0).toString(16));
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));

    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read('D6:63:90:E4:A9:B2', '1800', '2a04')
      .then((data) => {
        view1.setInt32(0, data);

        console.log('s:1800,c:2a04 - ' + view1.getInt32(0).toString(16));
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);

    this.ble
      .read('D6:63:90:E4:A9:B2', '1800', '2aa6')
      .then((data) => {
        view1.setInt32(0, data);

        console.log('s:1800,c:2aa6 - ' + view1.getInt32(0).toString(16));
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);

    this.ble
      .read('D6:63:90:E4:A9:B2', '180d', '2a38')
      .then((data) => {
        view1.setInt32(0, data);

        console.log('s:180d,c:2a38 - ' + view1.getInt32(0).toString(16));
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);

    this.ble
      .read('D6:63:90:E4:A9:B2', '180f', '2a19')
      .then((data) => {
        view1.setInt32(0, data);

        console.log('s:180f,c:2a19 - ' + view1.getInt32(0).toString(16));
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);

    this.ble
      .read('D6:63:90:E4:A9:B2', '180a', '2a29')
      .then((data) => {
        view1.setInt32(0, data);

        console.log('s:180a,c:2a29 - ' + view1.getInt32(0).toString(16));
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read('D6:63:90:E4:A9:B2', '1801', '2a05')
      .then((data) => {
        view1.setInt32(0, data);

        console.log('s:1801,c:2a05 - ' + view1.getInt32(0).toString(16));
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read('D6:63:90:E4:A9:B2', '180d', '2a37')
      .then((data) => {
        view1.setInt32(0, data);

        console.log('s:180d,c:2a37 - ' + view1.getInt32(0).toString(16));
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read(
        'D6:63:90:E4:A9:B2',
        '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
        '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
      )
      .then((data) => {
        view1.setInt32(0, data);

        console.log(
          's:6e400001-b5a3-f393-e0a9-e50e24dcca9e,c:6e400001-b5a3-f393-e0a9-e50e24dcca9e - ' +
            view1.getInt32(0).toString(16)
        );
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read(
        'D6:63:90:E4:A9:B2',
        '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
        '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
      )
      .then((data) => {
        view1.setInt32(0, data);
        console.log(
          's:6e400001-b5a3-f393-e0a9-e50e24dcca9e,c:6e400001-b5a3-f393-e0a9-e50e24dcca9e - ' +
            view1.getInt32(0).toString(16)
        );
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read('D6:63:90:E4:A9:B2', 'fe59', '8ec90003-f315-4f60-9fb8-838830daea50')
      .then((data) => {
        view1.setInt32(0, data);
        console.log(
          's:fe59,c:8ec90003-f315-4f60-9fb8-838830daea50 - ' +
            view1.getInt32(0).toString(16)
        );
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read(
        'D6:63:90:E4:A9:B2',
        'be940000-7333-be46-b7ae-689e71722bd5',
        'be940001-7333-be46-b7ae-689e71722bd5'
      )
      .then((data) => {
        view1.setInt32(0, data);
        console.log(
          's:be940000-7333-be46-b7ae-689e71722bd5,c:be940001-7333-be46-b7ae-689e71722bd5 -' +
            view1.getInt32(0).toString(16)
        );
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read(
        'D6:63:90:E4:A9:B2',
        'be940000-7333-be46-b7ae-689e71722bd5',
        'be940002-7333-be46-b7ae-689e71722bd5'
      )
      .then((data) => {
        view1.setInt32(0, data);
        console.log(
          's:be940000-7333-be46-b7ae-689e71722bd5,c:be940002-7333-be46-b7ae-689e71722bd5 -' +
            view1.getInt32(0).toString(16)
        );
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read(
        'D6:63:90:E4:A9:B2',
        'be940000-7333-be46-b7ae-689e71722bd5',
        'be940003-7333-be46-b7ae-689e71722bd5'
      )
      .then((data) => {
        view1.setInt32(0, data);
        console.log(
          's:be940000-7333-be46-b7ae-689e71722bd5,c:be940003-7333-be46-b7ae-689e71722bd5' +
            view1.getInt32(0).toString(16)
        );
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read('D6:63:90:E4:A9:B2', 'fee7', 'fec9')
      .then((data) => {
        view1.setInt32(0, data);
        console.log('s:fee7,c:fec9' + view1.getInt32(0).toString(16));
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read('D6:63:90:E4:A9:B2', 'fee7', 'fea1')
      .then((data) => {
        view1.setInt32(0, data);
        console.log('s:fee7,c:fea1' + view1.getInt32(0).toString(16));
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    buffer = new ArrayBuffer(16);
    view1 = new DataView(buffer);
    this.ble
      .read('D6:63:90:E4:A9:B2', 'fee7', 'fea2')
      .then((data) => {
        view1.setInt32(0, data);
        console.log('s:fee7,c:fea2' + view1.getInt32(0).toString(16));
        this.responses.push(view1.getInt32(0).toString(16));
      })
      .catch((error) => console.log(error));
    this.ble.read('D6:63:90:E4:A9:B2', '180F', '2A19').then((data) => {
      const strData = String.fromCharCode.apply(null, new Uint8Array(data));
      const bl = strData;
      alert('baterry level:' + bl);
    });
    this.ble.read('D6:63:90:E4:A9:B2', '1800', '2aa6').then((data) => {
      const strData = String.fromCharCode.apply(null, new Uint8Array(data));
      const bl = strData;
      alert('other thing:' + bl);
      console.log('other thing:' + bl);
    });
    this.ble.read('D6:63:90:E4:A9:B2', '1800', '2a00').then((data) => {
      const strData = String.fromCharCode.apply(null, new Uint8Array(data));
      const bl = strData;
      alert('other thing1:' + bl);
      console.log('other thing1:' + bl);
    });
    this.ble.read('D6:63:90:E4:A9:B2', '1800', '2a01').then((data) => {
      const strData = String.fromCharCode.apply(null, new Uint8Array(data));
      const bl = strData;
      alert('other thing2:' + bl);
      console.log('other thing2:' + bl);
    });
    this.ble.read('D6:63:90:E4:A9:B2', '1800', '2a04').then((data) => {
      const strData = String.fromCharCode.apply(null, new Uint8Array(data));
      const bl = strData;
      alert('other thing3:' + bl);
      console.log('other thing3:' + bl);
    });
    this.ble.read('D6:63:90:E4:A9:B2', '180d', '2a38').then((data) => {
      const strData = String.fromCharCode.apply(null, new Uint8Array(data));
      const bl = strData;
      alert('other thing4:' + bl);
      console.log('other thing4:' + bl);
    });
    this.ble.read('D6:63:90:E4:A9:B2', '180f', '2a19').then((data) => {
      const strData = String.fromCharCode.apply(null, new Uint8Array(data));
      const bl = strData;
      alert('other thing5:' + bl);
      console.log('other thing5:' + bl);
    });
    this.ble.read('D6:63:90:E4:A9:B2', '180a', '2a29').then((data) => {
      const strData = String.fromCharCode.apply(null, new Uint8Array(data));
      const bl = strData;
      alert('other thing6:' + bl);
      console.log('other thing6:' + bl);
    });
    this.ble.read('D6:63:90:E4:A9:B2', 'fee7', 'fec9').then((data) => {
      const strData = String.fromCharCode.apply(null, new Uint8Array(data));
      const bl = strData;
      alert('other thing7:' + bl);
      console.log('other thing7:' + bl);
    });
    this.ble.read('D6:63:90:E4:A9:B2', 'fee7', 'fea1').then((data) => {
      const strData = String.fromCharCode.apply(null, new Uint8Array(data));
      const bl = strData;
      alert('other thing8:' + bl);
      console.log('other thing8:' + bl);
    });
    this.ble.read('D6:63:90:E4:A9:B2', 'fee7', 'fea2').then((data) => {
      const strData = String.fromCharCode.apply(null, new Uint8Array(data));
      const bl = strData;
      alert('other thing9:' + bl);
      console.log('other thing9:' + bl);
    }); */
  }
  disconnect() {
    this.ble.disconnect('D6:63:90:E4:A9:B2').then(() => {
      console.log('Disconnected');
    });
  }
}
/*  this.ble.connect(device).subscribe(
      (peripheralData) => {
        console.log('Characteristics: ' + peripheralData.characteristics);
        this.characteristics = peripheralData.characteristics;
        console.log('Connected to: ', +device);
      },
      (peripheralData) => {
        alert('disconnected');
      }
    ); */
/*  (peripheralDAata) => {
        this.connectedDevice='';
        console.log('disconnected: ' + peripheralData);
      } */
/* BLE.scan([], 4).subscribe((device) => {
      console.log(device);
      if (device && device.name) {
        this.peripherals = [...this.peripherals, device.name];
        this.statusMessage = this.peripherals.reduce((a, b) => a + ', ' + b);
        console.log('Status message:' + this.statusMessage);
      }
    });
  }
  connect(device: any) {
    BLE.connect(device).subscribe(
      (peripheralData) => {
        console.log(peripheralData);
        this.statusMessage = 'connected';
        this.connectedDevice=peripheralData;
      },
     */
