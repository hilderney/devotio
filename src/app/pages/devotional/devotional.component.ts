import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { DevotionalItemComponent } from '../../components/devotional-item/devotional-item.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-devotional',
  templateUrl: './devotional.component.html',
  styleUrls: ['./devotional.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    PageLayoutComponent,
    DevotionalItemComponent]
})
export class DevotionalComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
