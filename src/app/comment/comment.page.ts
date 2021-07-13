import {
  Component,
  ElementRef,
  ViewChild,

} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { GoogleMapsComponent } from '../google-maps/google-maps.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage{
  @ViewChild(GoogleMapsComponent) mapComponent: GoogleMapsComponent;

	public commentForm: FormGroup;
  public submitAttempt: boolean = false;
  constructor(public formBuilder: FormBuilder){
    this.commentForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      age:['']
    });
  }
  save(){
    this.submitAttempt = true;
    if(!this.commentForm.valid){
      console.log("Invalid submit form");
      alert("Invalid submit form");
    }else{
      console.log("Success");
      console.log("Send to database");
    }
  }
  testMarker(){

    let center = this.mapComponent.map.getCenter();
    this.mapComponent.addMarker(center.lat(), center.lng());

}
}
