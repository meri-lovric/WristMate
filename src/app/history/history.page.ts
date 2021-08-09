import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { BLE } from '@ionic-native/ble/';
import { NavController, NavParams } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { TemperatureService } from '../read/temperature.service';

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
  data: any;
  constructor(private tempService: TemperatureService) {}

  ionViewDidEnter() {
    this.createBarChart();
  }
  onInit() {
    this.data = this.tempService.getTemperature('F6:EB:EA:13:2A:E2');
  }
  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          'S1',
          'S2',
          'S3',
          'S4',
          'S5',
          'S6',
          'S7',
          'S8',
          'S9',
          'S10',
          'S11',
        ],
        datasets: [
          {
            label: 'Viewers in millions',
            data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17, 6, 4.2, 15],
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
