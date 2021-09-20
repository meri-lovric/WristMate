import { Component, OnInit, ViewChild } from '@angular/core';

import { Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ElementRef } from '@angular/core';
// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { IonChip } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SlidesService } from '../slides/slides.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  @ViewChild('OneHourChip', { read: ElementRef }) hour: ElementRef;
  @ViewChild('OneDayChip', { read: ElementRef }) day: ElementRef;
  @ViewChild('OneWeekChip', { read: ElementRef }) week: ElementRef;
  graphValues = [];
  selectedDevice: any;
  bullets: any;
  updating = false;
  subscription: Subscription;
  calculatedValue: number;
  connectedDevices: Array<{
    device: any;
    values: Array<number>;
  }> = [
    /* {
      device: { id: 'F6:EB:EA:13:2A:E2', name: 'Device1', rssi: '20' },
      values: [36.8, 35.2, 38.0, 36, 35, 37.6, 39],
    },
    {
      device: { id: 'D6:63:90:E4:A9:B2', name: 'Device2', rssi: '90' },
      values: [39.8, 32.2, 33.0, 34, 38, 39.6, 37],
    }, */
  ];

  private chart: am4charts.XYChart;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    db: AngularFireDatabase,
    private slidesService: SlidesService
  ) {}
  ngOnInit(): void {
    this.subscription = this.slidesService.currentMessage.subscribe(
      (connectedDevices) => {
        // eslint-disable-next-line prefer-const
        this.connectedDevices = connectedDevices;
      }
    );
    this.selectedDevice = this.connectedDevices[0];
    if (this.selectedDevice != null) {
      this.getData('all');
      setTimeout(() => {
        this.createChart2();
        this.average();
      }, 2000);
    }
  }
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }
  randomFromInterval(min, max) {
    // min and max included
    return Math.random() * (max - min + 1) + min;
  }
  isIntervalSelected(chips: Array<IonChip>) {
    return chips.some((el) => el.color === 'success');
  }
  getData(interval: string) {
    console.log(interval);
    if (interval === 'all') {
      firebase.default
        .database()
        .ref()
        .child(this.selectedDevice.device.id + '/temperature')
        .orderByChild('key')
        .limitToLast(1000)
        .on('value', (snap) => {
          if (snap.val() != null) {
            const tmp = Object.entries(snap.val());
            tmp.map((el) => {
              if (el) {
                return el[1];
              }
            });
            if (tmp) {
              this.graphValues = tmp;
            }
          }
        });
    } else {
      let timeFrame;
      switch (interval) {
        case 'hour': {
          timeFrame = Date.now() - 60 * 60 * 1000;

          break;
        }
        case 'day': {
          timeFrame = Date.now() - 24 * 60 * 60 * 1000;

          break;
        }
        case 'week': {
          timeFrame = Date.now() - 7 * 24 * 60 * 60 * 1000;
          break;
        }
      }
      firebase.default
        .database()
        .ref()
        .child(this.selectedDevice.device.id + '/temperature')
        .orderByChild('key')
        .startAt(timeFrame)
        .limitToLast(1000)
        .on('value', (snap) => {
          if (snap.val() != null) {
            const tmp = Object.entries(snap.val());
            if (tmp.length > 0) {
              this.graphValues = tmp.map((el) => {
                if (el) {
                  return el;
                }
              });
              this.updateChart();
            }
          } else {
            alert('No data in last ' + interval.slice(1));
          }
        });
    }
  }
  onChooseDevice(value: any) {
    this.selectedDevice = this.connectedDevices.find(
      (el) => el.device.name === value.detail.value
    );
    console.log(this.selectedDevice);
    console.log(value.detail.value);
    this.getData('all');
    setTimeout(() => {
      this.updateChart();
    }, 1000);
    this.resetChips();
    this.average();
  }
  resetChips() {
    this.hour.nativeElement.style.background = 'lightskyblue';
    this.day.nativeElement.style.background = 'lightskyblue';
    this.week.nativeElement.style.background = 'lightskyblue';
  }
  onEntityChange(value: any) {
    console.log(value.detail.value);
    switch (value.detail.value) {
      case 'min': {
        this.minimum();
        break;
      }
      case 'max': {
        this.maximum();
        break;
      }
      case 'avg': {
        this.average();
        break;
      }
    }
    console.log(this.calculatedValue);
  }
  toggleChip(chip: IonChip, otherChips: Array<IonChip>, chipName: string) {
    this.average();

    switch (chipName) {
      case 'hour': {
        this.hour.nativeElement.style.background = 'lightcoral';
        this.day.nativeElement.style.background = 'lightskyblue';
        this.week.nativeElement.style.background = 'lightskyblue';
        break;
      }
      case 'day': {
        this.hour.nativeElement.style.background = 'lightskyblue';
        this.day.nativeElement.style.background = 'lightcoral';
        this.week.nativeElement.style.background = 'lightskyblue';
        break;
      }
      case 'week': {
        this.hour.nativeElement.style.background = 'lightskyblue';
        this.day.nativeElement.style.background = 'lightskyblue';
        this.week.nativeElement.style.background = 'lightcoral';
        break;
      }
    }
    this.getData(chipName);
  }
  minimum() {
    const values = this.graphValues.map((el) => el[1].value);
    const minimum = Math.min(...values).toFixed(2);
    this.calculatedValue = parseFloat(minimum);
  }
  maximum() {
    const values = this.graphValues.map((el) => el[1].value);

    const maximum = Math.max(...values).toFixed(2);
    this.calculatedValue = parseFloat(maximum);
  }
  average() {
    const values = this.graphValues.map((el) => el[1].value);
    const average = (values.reduce((a, b) => a + b) / values.length).toFixed(2);
    this.calculatedValue = parseFloat(average);
  }
  updateChart() {
    const data = [];
    if (this.graphValues) {
      this.graphValues.forEach((el) => {
        if (am4core.isNumber(el[1].value)) {
          data.push({ time: el[1].time, value: el[1].value });
        }
      });
    }

    this.chart.data = data;
    this.chart.validateData();
  }
  createChart2() {
    // Chart code goes in here

    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);
      const chart = am4core.create('chartdiv', am4charts.XYChart);
      chart.paddingRight = 20;

      const data = [];
      if (this.graphValues) {
        this.graphValues.forEach((el) => {
          if (am4core.isNumber(el[1].value)) {
            data.push({ time: el[1].time, value: el[1].value });
          }
        });
        chart.data = data;
      }
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = 'time';
      series.dataFields.valueY = 'value';
      series.tooltipText = '{valueY.value}';
      series.minBulletDistance = 15;
      series.tooltip.pointerOrientation = 'vertical';
      series.stroke = am4core.color('#32174D');

      series.bullets.push(new am4charts.CircleBullet());
      this.bullets = series.bullets;
      chart.cursor = new am4charts.XYCursor();

      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;
      this.chart = chart;
    });
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
