import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SwipeItemComponent } from '../../components/swipe-item/swipe-item.component';

@Component({
  selector: 'app-devotional',
  templateUrl: './devotional.component.html',
  styleUrls: ['./devotional.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    PageLayoutComponent,
    SwipeItemComponent]
})
export class DevotionalComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
