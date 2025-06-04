import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../shared/components/page-layout/page-layout.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-prayers',
  templateUrl: './prayers.component.html',
  styleUrls: ['./prayers.component.scss'],
  standalone: true,
  imports: [
    PageLayoutComponent,
    CommonModule,
    IonicModule
  ]
})
export class PrayersComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
