import { Component, OnInit, Input } from '@angular/core';

import { Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { AlertController, IonChip } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SlidesService } from '../slides/slides.service';
@Component({
  selector: 'app-multiple-devices',
  templateUrl: './multiple-devices.page.html',
  styleUrls: ['./multiple-devices.page.scss'],
})
export class MultipleDevicesPage implements OnInit {
  graphValues = [];
  selectedDevice: any;
  bullets: any;
  updating = false;
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
        for (let device of connectedDevices) {
          this.connectedDevices.push({ device, values: [] });
        }
      }
    );
    if (this.connectedDevices.length === 1) {
      this.selectedDevice = this.connectedDevices[0];
    }
  }

  chooseInterval() {}
  /* getData(interval: string, iter: number) {
    let timeFrame;
    let tmp;
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Async work complete');
        firebase.default
          .database()
          .ref()
          .child(this.selectedDevice.device.id + '/temperature')
          .orderByChild('key')
          .on('value', (snap) => {
            console.log(snap.val());
            if (snap.val() != null) {
              console.log(snap.val());
              tmp = Object.entries(snap.val());
              tmp = tmp.map((el) => {
                if (el) {
                  return el[1];
                }
              });
              console.log('IN FUNCTION:', tmp);
            }
          });
        resolve(tmp);
      }, 1000);
    });
    return promise;
    /* switch (interval) {
      case '1hour': {
        timeFrame = Date.now() - iter * 60 * 60 * 1000;
        break;
      }
      case '1day': {
        timeFrame = Date.now() - iter * 60 * 60 * 1000;
        break;
      }
      case '1week': {
        timeFrame = Date.now() - iter * 60 * 60 * 1000;
        break;
      }
      case 'all': {
        firebase.default
          .database()
          .ref()
          .child(this.selectedDevice.device.id + '/temperature')
          .orderByChild('key')
          .on('value', (snap) => {
            console.log(snap.val());
            if (snap.val() != null) {
              console.log(snap.val());
              tmp = Object.entries(snap.val());
              tmp = tmp.map((el) => {
                if (el) {
                  return el[1];
                }
              });
              console.log('IN FUNCTION:', tmp);
            }
          });
      }
    }
    if (interval !== 'all') {
      firebase.default
        .database()
        .ref()
        .child(this.selectedDevice.device.id + '/temperature')
        .orderByChild('key')
        .startAt(timeFrame)
        .on('value', (snap) => {
          console.log(snap.val());
          if (snap.val() != null) {
            console.log(snap.val());
            tmp = Object.entries(snap.val());
            tmp = tmp.map((el) => {
              if (el) {
                return el[1];
              }
            });
            console.log('IN FUNCTION:', tmp);
          }
        });
    }
    return tmp;
  } */
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
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
          console.log(snap.val());
          if (snap.val() != null) {
            console.log(snap.val());
            /*         this.graphValues = Object.entries(snap.val());
             */ const tmp = Object.entries(snap.val());
            tmp.map((el) => {
              if (el) {
                return el[1];
              }
            });
            if (tmp) {
              this.graphValues = tmp;
            }
            console.log('IN FUNCTION:', this.graphValues);
          }
        });
    } else {
      let timeFrame;
      switch (interval) {
        case '1hour': {
          timeFrame = Date.now() - 60 * 60 * 1000;

          break;
        }
        case '1day': {
          timeFrame = Date.now() - 24 * 60 * 60 * 1000;

          break;
        }
        case '1week': {
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
          console.log(snap.val());
          if (snap.val() != null) {
            console.log(snap.val());
            const tmp = Object.entries(snap.val());
            if (tmp) {
              this.graphValues = tmp.map((el) => {
                if (el) {
                  return el[1];
                }
              });
            }
            console.log('IN FUNCTION:', this.graphValues);
          } else {
            this.graphValues = [];
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
    this.createChart2();
  }
  onChooseMeasure(value: any) {
    switch (value) {
      case 'min': {
        this.minimum();
        break;
      }
    }
  }
  toggleChip(chip: IonChip, otherChips: Array<IonChip>, chipName: string) {
    chip.color = 'success';
    otherChips.forEach((e) => (e.color = 'danger'));
    this.getData(chipName);
    setTimeout(() => {
      this.updating = true;
      this.updateChart();
    }, 1000);
    this.zone.run(() => {
      this.updating = false;
      console.log(this.updating);
    });
  }
  createChart(option: string) {
    // Chart code goes in here

    this.browserOnly(async () => {
      this.updating = true;
      am4core.useTheme(am4themes_animated);

      const chart = am4core.create('chartdiv', am4charts.XYChart);
      chart.events.on('ready', () => {
        console.log('ready');
        this.updating = false;
      });
      chart.paddingRight = 20;
      const data = [];

      //this.chooseInterval(option);
      console.log(this.graphValues);

      if (this.graphValues) {
        this.graphValues.forEach((el) => {
          if (am4core.isNumber(el.value)) {
            data.push({ time: el.time, value: el.value });
          }
        });
        console.log(data);
        chart.data = data;
      }
      /* this.getData(option, 1)
        .then((result) => {
          console.log('RESULT', result);
          this.graphValues.forEach((el) => {
            if (am4core.isNumber(el.value)) {
              data.push({ time: el.time, value: el.value });
            }
          });
          console.log(data);
          chart.data = data;
        })
        .catch((error) => console.log(error));
 */
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = 'time';
      series.dataFields.valueY = 'value';
      series.tooltipText = '{valueY.value}';

      chart.cursor = new am4charts.XYCursor();

      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      this.chart = chart;
    });
  }
  minimum() {
    const minimum = Math.min(...this.graphValues);
    console.log(minimum);
    console.log(this.bullets);
    this.bullets.find((el) => el === minimum).stroke =
      am4core.color('#fffbb00');
  }
  updateChart() {
    const data = [];
    this.updating = true;
    if (this.graphValues) {
      this.graphValues.forEach((el) => {
        console.log(el);
        if (am4core.isNumber(el[1].value)) {
          console.log(el[1].value);
          data.push({ time: el[1].time, value: el[1].value });
        }
      });
      console.log(this.graphValues);
      console.log(data);
    }
    if (data) {
      this.updating = false;
    }
    this.chart.data = data;
    this.chart.validateData(); // async???;
  }
  createChart2() {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);
      /*   this.updating = true;
       */ const chart = am4core.create('chartdiv', am4charts.XYChart);
      /*  chart.events.on('ready', () => {
        this.updating = false;
        console.log('ready');
      }); */
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
      // series.strokeWidth = 2;
      series.minBulletDistance = 15;
      series.fillOpacity = 0.5;
      series.tooltip.background.strokeOpacity = 0.5;
      series.tooltip.pointerOrientation = 'vertical';
      series.stroke = am4core.color('#a232a8');
      series.fill = am4core.color('#a232a8');

      series.bullets.push(new am4charts.CircleBullet());
      this.bullets = series.bullets;
      //this.bullets.circle.strokeWidth = 2;
      // this.bullets.circle.radius = 4;
      // this.bullets.circle.fill = am4core.color('#fff');
      chart.cursor = new am4charts.XYCursor();

      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;
      this.chart = chart;
    });
    /* const promise = new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        console.log('Async');
        resolve();
      }, 1000);
    });
    return promise; */
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
