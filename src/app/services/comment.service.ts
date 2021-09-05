import { Injectable } from '@angular/core';
import {Comment} from '../../templates/Comment';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  temperatureListRef: AngularFireList<any>;
  commentListRef: AngularFireList<any>;
  temperatureRef: AngularFireObject<any>;
  constructor(private db: AngularFireDatabase) {}

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
