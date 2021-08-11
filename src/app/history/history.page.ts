import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { BLE } from '@ionic-native/ble/';
import { IonChip, NavController, NavParams } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { TemperatureService } from '../read/temperature.service';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';

Chart.register(...registerables, zoomPlugin);
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage {
  @ViewChild('barChart') barChart;

  bars: any;
  colorArray: any;
  values: Array<any> = [];
  data: Observable<any[]>;
  graphValues = [];
  labels = [];
  constructor(firestore: AngularFireDatabase) {
    try {
      this.data = firestore
        .list('F6:EB:EA:13:2A:E2/temperature')
        .valueChanges();
    } catch {
      this.data.forEach((e) =>
        this.values.push(e)
      ); /* this.values.push(e.value) */
      this.graphValues = this.values[0].map((e) => e.value);
      console.log(this.graphValues);
    }
  }
  toggleOneChip(chip: IonChip) {
    chip.color = 'danger';
  }
  toggleChip(chip: IonChip, otherChips: Array<IonChip>) {
    chip.color = 'success';
    otherChips.forEach((e) => (e.color = 'danger'));
  }
  createGraph(interval: string) {
    switch (interval) {
      case '1hour': {
        this.graphValues = this.graphValues.slice(0).slice(-6);
        console.log('1hour');
        break;
      }
      case '24hours': {
        let numberOfIntervals = 144;
        if (this.graphValues.length < 144) {
          numberOfIntervals = this.graphValues.length / 10;
        }
        console.log('Number of intervals', numberOfIntervals);
        const tempData = this.graphValues.slice(0).slice(-numberOfIntervals);
        console.log('Temp: ', tempData);
        const [...arr] = tempData;
        const res = [];
        while (arr.length) {
          res.push(arr.splice(0, 24));
        }
        console.log('24hours: ', res );
/*         calculateAverage(res);
 */        break;
      }
      case '7days': {
        console.log('7days');

        break;
      }
      default: {
        console.log('Invalid interval');
      }
    }
  }
/*   calculateAverage(result: Array<Array<any>>){
    let temp;
    let sum = 0;
    result.forEach()
  }
 */  ionViewDidEnter() {
    /*     this.createBarChart();
     */
  }
  onInit() {
    /*     this.data = this.tempService.getTemperature('F6:EB:EA:13:2A:E2');
    console.log('DATA', this.data);
 */
  }
  printData() {
    this.data.forEach((e) =>
      this.values.push(e)
    ); /* this.values.push(e.value) */
    console.log(this.values[0]);
    this.graphValues = this.values[0].map((e) => e.value);
    this.labels = this.values[0].map((e) => e.time);
    this.graphValues = this.graphValues.slice(0).slice(-10);
    //this.labels = this.labels.slice(0).slice(-10);
    this.labels = ['10', '11', '12', '13', '14', '15', '16'];
    console.log(this.graphValues);
    this.createBarChart();
  }
  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
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
