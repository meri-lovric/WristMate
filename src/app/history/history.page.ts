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
  interval: string;
  subscription: Subscription;
  displayData: number;
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
  isIntervalSelected(chips: Array<IonChip>) {
    return chips.some((el) => el.color === 'success');
  }
  minimum() {
    this.resetChartColors();
    const minimum = Math.min(...this.graphValues);
    this.bars.data.datasets[0].data.forEach((el, i) => {
      if (el === minimum) {
        this.bars.data.datasets[0].pointBorderColor[i] = '#cc00cc';
      }
    });
    this.bars.update();
    this.displayData = minimum;
  }
  maximum() {
    this.resetChartColors();
    const maximum = Math.max(...this.graphValues);
    this.bars.data.datasets[0].data.forEach((el, i) => {
      if (el === maximum) {
        this.bars.data.datasets[0].pointBorderColor[i] = '#cc00cc';
      }
    });
    this.bars.update();
    this.displayData = maximum;
  }
  getHourlyData(iter: number, step: number) {
    firebase.default
      .database()
      .ref()
      .child(this.selectedDevice.device.id + '/temperature')
      .orderByChild('key')
      .startAt(new Date().getTime() - step * iter * 3600 * 1000)
      .on('value', (snap) => {
        console.log(snap.val());
        if (snap.val() === null) {
          this.getHourlyData(++iter, step);
        } else {
          console.log(snap.val());
          this.graphValues = Object.entries(snap.val());
          this.graphValues.forEach((el, i) => {
            this.labels.push(el[1].time.substring(17, 22));
            console.log('EL: ', el[1].time.substring(17, 22));
          });
          this.graphValues = this.graphValues.map((el) => el[1].value);
          console.log('IN FUNCTION:', this.graphValues);
          console.log(step);
          this.createChart('line');
        }
      });
  }
  createGraph(interval: string) {
    if (this.bars) {
      this.bars.destroy();
    }
    this.labels = [];
    switch (interval) {
      case '1hour': {
        this.interval = '1 hour';
        this.getHourlyData(1, 1);
        break;
      }
      case '24hours': {
        this.interval = '24 hours';
        this.getHourlyData(1, 24);
        /*  let numberOfIntervals = 144;
        console.log('LENGTH: ', this.graphValues.length);
        //if (this.graphValues.length < numberOfIntervals) {
        numberOfIntervals = Math.round(
          this.graphValues.length / numberOfIntervals
        );
        //}
        this.calculateAverage(numberOfIntervals);
        console.log('Number of intervals', numberOfIntervals);
        */ /* this.createChart('line');
         */ break;
      }
      case '7days': {
        console.log('7days');
        this.interval = '7 days';
        this.getHourlyData(1, 168);
        /*  let numberOfIntervals = 1008;
        if (this.graphValues.length < numberOfIntervals) {
          numberOfIntervals = Math.round(this.graphValues.length / 1008);
          console.log('NUM', numberOfIntervals);
        }
        this.calculateAverage(numberOfIntervals);
        */ /* this.createChart('line');
         */ break;
      }
      default: {
        console.log('Invalid interval');
        this.bars.destroy();
        break;
      }
    }
  }
  divideIntoSubarrays(intervals: number) {
    const res = [];
    for (let i = 0; i < this.graphValues.length; i += intervals) {
      const chunk = this.graphValues.slice(i, i + intervals);
      res.push(chunk);
    }
    console.log('res', res);
    return res;
  }
  average() {
    const average =
      this.graphValues.reduce((a, b) => a + b) / this.graphValues.length;
    console.log(average);
    this.displayData = average;
  }
  ionViewDidEnter() {}
  onInit() {
    /*     this.createChart('line');
     */
  }
  resetChartColors() {
    this.bars.data.datasets[0].pointBorderColor = this.graphValues.map(
      (el) => 'rgb(38,104,129)'
    );
  }
  createChart(chartType: string) {
    if (this.bars) {
      this.bars.destroy();
    }
    const backgroundColors = this.graphValues.map((value) => 'rgb(38,104,129)');
    switch (chartType) {
      case 'line':
        this.bars = new Chart(this.chart.nativeElement, {
          type: 'line',
          data: {
            labels: this.labels,
            datasets: [
              {
                data: this.graphValues,
                /*  backgroundColor: 'rgb(38,194,129)', // array should have same number of elements as number of dataset
                 */ /* borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
                 */ pointBorderColor: backgroundColors,
                pointBorderWidth: 5,
                label: 'Temperature data',
                fill: false,
              },
            ],
          },
          options: {
            elements: {
              point: {
                radius: 1,
              },
            },
            responsive: true,
            scales: {
              x: {
                ticks: {
                  color: 'red',
                },
              },
              y: {
                min: 30,
                max: 40,
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
                  mode: 'y',
                },
                pan: {
                  enabled: true,
                  mode: 'x',
                  threshold: 10,
                  /* onPanComplete(chart){
                    console.log('Panned', chart);
                    } */
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
                label: 'Temperature data',
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
                max: 24,
                ticks: {
                  maxTicksLimit: 24,
                },
              },
              y: {
                //beginAtZero: true,
                min: 30,
                max: 40,
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
