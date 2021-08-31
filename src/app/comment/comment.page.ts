import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { GoogleMapsComponent } from '../google-maps/google-maps.component';
import { Subscription } from 'rxjs';
import { SlidesService } from '../slides/slides.service';
import { TemperatureService } from '../read/temperature.service';
import { calcPossibleSecurityContexts } from '@angular/compiler/src/template_parser/binding_parser';
import { Comment } from '../../templates/Comment';
import { Plugins } from '@capacitor/core';
import { last } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { Geolocation } = Plugins;
declare const google: any;

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage {
  @ViewChild(GoogleMapsComponent) mapComponent: GoogleMapsComponent;

  public commentForm: FormGroup;
  public submitFailed = false;
  public isChecked = false;
  subscription: Subscription;
  selectedDevice: any;
  inputValue: string;
  now: Date;

  connectedDevices: Array<{
    device: any;
    values: Array<any>;
  }> = [
    {
      device: { id: 'F6:EB:EA:13:2A:E2', name: 'Device1', rssi: '20' },
      values: [
        { value: 36.8, time: '12:00:00' },
        { value: 35.2, time: '12:10:00' },
        { value: 38.0, time: '12:20:00' },
        { value: 36, time: '12:30:00' },
        { value: 35, time: '12:40:00' },
        { value: 37.6, time: '12:50:00' },
        { value: 39, time: '13:00:00' },
      ],
    },
    {
      device: { id: 'F6:EB:EA:13:2A:E2', name: 'Device1', rssi: '20' },
      values: [
        { value: 36.8, time: '12:00:00' },
        { value: 35.2, time: '12:10:00' },
        { value: 38.0, time: '12:20:00' },
        { value: 36, time: '12:30:00' },
        { value: 39, time: '13:00:00' },
      ],
    },
    {
      device: { id: 'A2:EB:EA:13:2A:E2', name: 'Device2', rssi: '20' },
      values: [
        { value: 36.8, time: '12:00:00' },
        { value: 35.2, time: '12:10:00' },
        { value: 38.0, time: '12:20:00' },
        { value: 36, time: '12:30:00' },
        { value: 35, time: '12:40:00' },
        { value: 37.6, time: '12:50:00' },
        { value: 39, time: '13:00:00' },
      ],
    },
  ];

  constructor(
    public formBuilder: FormBuilder,
    private slidesService: SlidesService,
    private tempService: TemperatureService,
    private toastController: ToastController
  ) /*   private geolocation: Geolocation
   */ {
    this.commentForm = formBuilder.group({
      firstName: [
        '',
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ]),
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ]),
      ],
      age: [''],
    });

    setInterval(() => {
      this.now = new Date();
    }, 1);
  }
  onInit() {
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
    this.testMarker();
  }
  save() {
    let commentObject = new Comment();
    commentObject = {
      key: new Date().getTime(),
      value: this.inputValue,
      time: this.now.toUTCString(),
      location: null,
    };
    if (this.isChecked) {
      commentObject.location = this.location();
    }
    if (commentObject) {
      try {
        this.tempService.createComment(
          this.selectedDevice.device.id,
          commentObject
        );
      } catch {
        console.log('Error sending comment');
        this.submitFailed = true;
      } finally {
        this.inputValue = '';
      }
      this.presentSubmitToast(this.submitFailed);
    }
  }
  testMarker() {
    const center = this.mapComponent.map.getCenter();
    this.mapComponent.addMarker(center.lat(), center.lng());
    Geolocation.getCurrentPosition().then((position) => {
      const latLng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      this.location();
    });
  }
  onEntityChange(value: any) {
    console.log(value);
    this.selectedDevice = this.connectedDevices.find(
      (el) => el.device.name === value.detail.value
    );
  }
  async presentSubmitToast(submitFailed: boolean) {
    const toast = await this.toastController.create({
      message: !submitFailed ? 'Comment sent' : 'Sending failed.',
      duration: 2000,
    });
    toast.present();
  }
  location() {
    if (this.isChecked) {
      Geolocation.getCurrentPosition().then((position) => {
        const latLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        console.log(latLng);
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          {
            latLng,
          },
          // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
          function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              console.log(results[0]);
              if (results[1]) {
                alert(results[1].formatted_address);
                console.log(results[1].formatted_address);
                return results[1].formatted_address;
              } else {
                alert('No results found');
              }
            } else {
              alert('Geocoder failed due to: ' + status);
            }
          }
        );
        console.log(latLng);

        return latLng;
      });
    }
    return null;
  }
}
