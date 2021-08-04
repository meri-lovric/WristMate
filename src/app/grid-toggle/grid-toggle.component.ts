import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid-toggle',
  templateUrl: './grid-toggle.component.html',
  styleUrls: ['./grid-toggle.component.scss'],
})
export class GridToggleComponent implements OnInit {

  constructor() { }
  
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }
  ngOnInit() { }

}
