import { Injectable } from '@angular/core';
import { Temperature } from '../../templates/Temperature';
import {Comment} from '../../templates/Comment';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/database';
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';

@Injectable({
  providedIn: 'root',
})
export class TemperatureService {
  temperatureListRef: AngularFireList<any>;
  commentListRef: AngularFireList<any>;
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
    this.temperatureRef = this.db.object(
      '/' + id + '/temperature/' + '-MgfO9QybDID-3DDL_xb'
    );
    return this.temperatureRef;
  }
  updateTemperature(id: string, temp: Temperature) {
    return this.temperatureRef.update({
      value: temp.value,
      time: temp.time,
    });
  }
  deleteTemperature(id: string) {
    this.temperatureRef = this.db.object('/temperature/' + id);
    this.temperatureRef.remove();
  }
  createComment(device: string, comment: Comment){
    this.commentListRef = this.db.list('/' + device + '/comments/');
    return this.commentListRef.push({
      key: comment.key,
      comment: comment.value,
      time: comment.time,
      location: comment.location
    });
  }
}
