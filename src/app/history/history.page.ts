import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { BLE } from '@ionic-native/ble/';
import { IonChip, NavController, NavParams } from '@ionic/angular';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { TemperatureService } from '../read/temperature.service';
import { Observable, Subscription } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { SlidesService } from '../slides/slides.service';
import * as firebase from 'firebase';

Chart.register(...registerables, zoomPlugin);
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage {
  @ViewChild('chart') chart;

  bars: any;
  colorArray: any;
  values: Array<any> = [];
  data: Observable<any[]>;
  graphValues = [];
  labels = [];
  selectedDevice: any;
  subscription: Subscription;
  connectedDevices: Array<{
    device: any;
    values: Array<number>;
  }> = [
    {
      device: { id: 'F6:EB:EA:13:2A:E2', name: 'Device1', rssi: '20' },
      values: [36.8, 35.2, 38.0, 36, 35, 37.6, 39],
    },
    {
      device: { id: 'D6:63:90:E4:A9:B2', name: 'Device2', rssi: '90' },
      values: [39.8, 32.2, 33.0, 34, 38, 39.6, 37],
    },
  ];
  constructor(db: AngularFireDatabase, private slidesService: SlidesService) {
    if (this.connectedDevices.length === 1) {
      try {
        this.data = db
          .list(this.connectedDevices[0].device.id + '/temperature')
          .valueChanges();
      } catch (error) {
        console.log(error);
        /* this.values.push(e.value)
      this.graphValues = this.values[0].map((e) => e.value);
      console.log(this.graphValues); */
      } finally {
        this.data.forEach((e) => this.values.push(e));
      }
    }
  }
  toggleChip(chip: IonChip, otherChips: Array<IonChip>) {
    chip.color = 'success';
    otherChips.forEach((e) => (e.color = 'danger'));
  }
  onEntityChange(value: any) {
    this.selectedDevice = this.connectedDevices.find(
      (el) => el.device.name === value.detail.value
    );
    console.log(this.selectedDevice);
    console.log(value.detail.value);
  }
  getHourlyData(iter: number, step: number) {
    firebase.default
      .database()
      .ref()
      .child(this.selectedDevice.device.id + '/temperature')
      .orderByChild('key')
      .startAt(new Date().getTime() - iter * 3600 * 1000)
      .on('value', (snap) => {
        console.log(snap.val());
        if (snap.val() === null) {
          this.getHourlyData(++iter, step);
        } else {
          console.log(snap.val());
          this.graphValues = Object.entries(snap.val());
          this.graphValues = this.graphValues.map((el) => el[1].value);
          this.graphValues.forEach((el, i) => this.labels.push(i + 1));
          console.log('IN FUNCTION:', this.graphValues);
          console.log(step);
          if (step === 1) {
            this.createChart('line');
          }
        }
      });
  }
  createGraph(interval: string) {
    if (this.bars) {
      this.bars.destroy();
    }
    switch (interval) {
      case '1hour': {
        this.getHourlyData(1, 1);
        break;
      }
      case '24hours': {
        this.getHourlyData(1, 24);
        let numberOfIntervals = 144;
        if (this.graphValues.length < 144) {
          numberOfIntervals = Math.round(this.graphValues.length / 10);
          this.calculateAverage(numberOfIntervals);
        }
        this.calculateAverage(numberOfIntervals);
        console.log('Number of intervals', numberOfIntervals);
        this.createChart('bar');
        break;
      }
      case '7days': {
        console.log('7days');

        break;
      }
      default: {
        console.log('Invalid interval');
        this.bars.destroy();
      }
    }
  }
  calculateAverage(intervals: number) {
    const res = [];
    for (let i = 0; i < this.graphValues.length; i += intervals) {
      const chunk = this.graphValues.slice(i, i + intervals);
      res.push(chunk);
    }
    console.log(res);
    this.graphValues = [];
    res.forEach((el) => {
      const average = el.reduce((a, b) => a + b) / el.length;
      console.log(average);
      this.graphValues.push(average);
    });
  }
  ionViewDidEnter() {
  }
  onInit() {
/*     this.createChart('line');
 */  }
  createChart(chartType: string) {
    if (this.bars) {
      this.bars.destroy();
    }
    switch (chartType) {
      case 'line':
        this.bars = new Chart(this.chart.nativeElement, {
          type: 'line',
          data: {
            labels: this.labels,
            datasets: [
              {
                data: this.graphValues,
                backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
                borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
                borderWidth: 1,
                label: 'Last hour data',
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                ticks: {
                  callback(val, index) {
                    // Hide the label of every 2nd dataset
                    return index % 3 === 0 ? this.getLabelForValue(val) : '';
                  },
                  color: 'red',
                },
              },
            },
            plugins: {
              zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true,
                  },
                  mode: 'xy',
                },
              },
            },
          },
        });
        break;
      case 'bar':
        this.bars = new Chart(this.chart.nativeElement, {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: [
              {
                label: 'Viewers in millions',
                data: this.graphValues,
                backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
                borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                ticks: {
                  maxTicksLimit: 10,
                },
              },
            },
            plugins: {
              zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true,
                  },
                  mode: 'xy',
                },
              },
            },
          },
        });
    }
  }
}
