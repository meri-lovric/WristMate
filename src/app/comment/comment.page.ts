import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterContentInit,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
declare const google;
@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit, AfterContentInit {
  @ViewChild('mapElement') mapElement;
  map;
  constructor(private geolocation: Geolocation) {}
  ngOnInit(): void {
    this.findLocation();
  }
  ngAfterContentInit(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: 41.1826, lng: -8.5581 },
      zoom: 8,
    });
  }
  findLocation() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        console.log(
          'LAT,LONG: ',
          resp.coords.latitude,
          '-',
          resp.coords.longitude
        );
        // resp.coords.latitude
        // resp.coords.longitude
      })
      .catch((error) => {
        console.log('Error getting location', error);
      });
    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }
}
