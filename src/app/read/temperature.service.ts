import { Injectable } from '@angular/core';
import { Temperature } from '../../templates/Temperature';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class TemperatureService {
  temperatureListRef: AngularFireList<any>;
  temperatureRef: AngularFireObject<any>;
  constructor(private db: AngularFireDatabase) {}

  createTemperature(device: string, temp: Temperature) {
    this.temperatureListRef = this.db.list('/' + device + '/temperature/');
    return this.temperatureListRef.push({
      key: temp.key,
      value: temp.value,
      time: temp.time,
    });

    /* this.temperatureRef=this.db.object('/'+device+'/temperature/');
    return this.temperatureListRef.push({
      value: temp.value,
      time: temp.time,
    }); */
  }
  getTemperature(id: string) {
    this.temperatureRef = this.db.object('/temperature/' + id);
    return this.temperatureRef;
  }
  updateTemperature(id, temp: Temperature) {
    return this.temperatureRef.update({
      value: temp.value,
      time: temp.time,
    });
  }
  deleteTemperature(id: string) {
    this.temperatureRef = this.db.object('/temperature/' + id);
    this.temperatureRef.remove();
  }
}
