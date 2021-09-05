import { Injectable } from '@angular/core';
import { Profile } from '../../templates/Profile';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/database';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  profilesListRef: AngularFireList<any>;
  commentListRef: AngularFireList<any>;
  temperatureRef: AngularFireObject<any>;
  private profile;
  constructor(private db: AngularFireDatabase) {}

  createProfile(device: string, profile: Profile) {
    this.profilesListRef = this.db.list('/' + '/profiles/');
    return this.profilesListRef.push({
      key: profile.key,
      name: profile.name,
      age: profile.age,
      room: profile.room,
      state: profile.state,
      height: profile.height,
      weight: profile.weight,
      braceletName: device,
    });

    /* this.temperatureRef=this.db.object('/'+device+'/temperature/');
    return this.temperatureListRef.push({
      value: temp.value,
      time: temp.time,
    }); */
  }
  getProfile(id: string) {
    firebase.default
      .database()
      .ref()
      .child('/profiles')
      .on('value', (snap) => {
        console.log(snap.val());
        console.log(id);
        if (snap.val() != null) {
          console.log(snap.val());
          const profiles = Object.values(snap.val());
          profiles.forEach((el) => {
            if ((el as any).braceletName === id) {
              this.profile = el as any;
              console.log(this.profile);
              }
          });
        } else {
          this.profile=null;
        }
      });
      return this.profile;
  }
  /*  updateTemperature(id: string, temp: Temperature) {
    return this.temperatureRef.update({
      value: temp.value,
      time: temp.time,
    });
  }
  deleteTemperature(id: string) {
    this.temperatureRef = this.db.object('/temperature/' + id);
    this.temperatureRef.remove();
  }
  createComment(device: string, comment: Comment) {
    this.commentListRef = this.db.list('/' + device + '/comments/');
    return this.commentListRef.push({
      key: comment.key,
      comment: comment.value,
      time: comment.time,
      location: comment.location,
    });
  } */
}
