import { Component, OnInit, ViewChild } from '@angular/core';
import { BLE } from '@ionic-native/ble/';
import { NavController, NavParams } from '@ionic/angular';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-historx',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  @ViewChild('barChart') barChart;

  bars: any;
  colorArray: any;
  constructor() {}

  ngOnInit(): void {}

  ionViewDidEnter() {
    this.createBarChart();
  }
  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
        datasets: [
          {
            label: 'Viewers in millions',
            data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
            backgroundColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        /* scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        } */
      },
    });
  }
}
