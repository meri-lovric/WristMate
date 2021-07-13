import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentPageRoutingModule } from './comment-routing.module';

import { CommentPage } from './comment.page';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsComponent } from '../google-maps/google-maps.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommentPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CommentPage, GoogleMapsComponent],
  exports: [GoogleMapsComponent],
})
export class CommentPageModule {}
